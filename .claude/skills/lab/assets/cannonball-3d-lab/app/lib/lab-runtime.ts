import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { ScenePlan, ScenePrimitive } from "./scene-plan";

export type DiagnosticMode = "beauty" | "albedo" | "wireframe" | "normals" | "uv";
export type DeviceProfile = "mobile" | "tablet" | "desktop";
export type ColliderMode = "off" | "box" | "sphere" | "convex";

export type SceneMetrics = {
  vertices: number;
  triangles: number;
  meshes: number;
  materials: number;
  textures: number;
  animations: number;
  drawCalls: number;
  frameTriangles: number;
  programs: number;
  geometries: number;
  gpuTextures: number;
  width: number;
  height: number;
  dpr: number;
  bounds: [number, number, number];
  diagonal: number;
  normalizationScale: number;
  loadMs: number;
};

type RuntimeCallbacks = {
  onMetrics: (metrics: SceneMetrics) => void;
  onProgress: (progress: number | null) => void;
  onError: (message: string | null) => void;
  onAnimationState: (available: boolean, playing: boolean) => void;
};

const PROFILE = {
  mobile: { dpr: 1, fps: 30 },
  tablet: { dpr: 1.25, fps: 45 },
  desktop: { dpr: 1.5, fps: 60 },
} as const;

const UV_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const UV_FRAGMENT = `
varying vec2 vUv;
float line(float value, float width) {
  float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
  return 1.0 - min(grid / width, 1.0);
}
void main() {
  vec2 tile = vUv * 10.0;
  float fine = max(line(tile.x, 1.1), line(tile.y, 1.1));
  float major = max(line(vUv.x, 1.8), line(vUv.y, 1.8));
  vec3 a = vec3(0.055, 0.065, 0.078);
  vec3 b = vec3(0.19, 0.22, 0.25);
  float checker = mod(floor(tile.x) + floor(tile.y), 2.0);
  vec3 color = mix(a, b, checker);
  color = mix(color, vec3(0.76, 1.0, 0.31), fine * 0.75);
  color = mix(color, vec3(1.0), major);
  gl_FragColor = vec4(color, 1.0);
}`;

function materialList(material: THREE.Material | THREE.Material[]) {
  return Array.isArray(material) ? material : [material];
}

function collectTextures(material: THREE.Material, target: Set<THREE.Texture>) {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) target.add(value);
  }
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    for (const material of materialList(object.material)) {
      const textures = new Set<THREE.Texture>();
      collectTextures(material, textures);
      textures.forEach((texture) => texture.dispose());
      material.dispose();
    }
  });
}

export class LabRuntime {
  private canvas: HTMLCanvasElement;
  private callbacks: RuntimeCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
  private controls: OrbitControls;
  private modelStage = new THREE.Group();
  private model: THREE.Object3D | null = null;
  private boundsHelper: THREE.Box3Helper | null = null;
  private collider: THREE.Object3D | null = null;
  private colliderMode: ColliderMode = "off";
  private grid = new THREE.GridHelper(12, 24, 0x4b525b, 0x282d33);
  private axes = new THREE.AxesHelper(1.2);
  private originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
  private overrides = new Set<THREE.Material>();
  private environment: THREE.Texture | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock = new THREE.Clock();
  private playing = false;
  private visible = true;
  private showBounds = true;
  private frame: number | null = null;
  private lastFrame = 0;
  private lastMetricsEmit = 0;
  private loadGeneration = 0;
  private profile: DeviceProfile = "desktop";
  private staticMetrics: Omit<SceneMetrics, "drawCalls" | "frameTriangles" | "programs" | "geometries" | "gpuTextures" | "width" | "height" | "dpr"> = {
    vertices: 0, triangles: 0, meshes: 0, materials: 0, textures: 0, animations: 0,
    bounds: [0, 0, 0], diagonal: 0, normalizationScale: 1, loadMs: 0,
  };
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private onVisibility = () => {
    this.visible = !document.hidden;
    if (this.visible) this.invalidate();
  };

  constructor(canvas: HTMLCanvasElement, callbacks: RuntimeCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.scene.background = new THREE.Color(0x101316);
    this.scene.add(this.modelStage, this.grid, this.axes);

    const hemi = new THREE.HemisphereLight(0xe4edff, 0x24201c, 1.35);
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(4, 6, 5);
    this.scene.add(hemi, key);

    this.camera.position.set(3, 2, 3);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = false;
    this.controls.screenSpacePanning = true;
    this.controls.addEventListener("change", this.invalidate);

    this.grid.position.y = -0.002;
    this.grid.material.opacity = 0.32;
    this.grid.material.transparent = true;
    this.axes.visible = false;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting && !document.hidden;
      if (this.visible) this.invalidate();
    });
    this.intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.setProfile("desktop");
    this.resize();
  }

  private assetUrl(path: string) {
    return `/assets-3d/${path.split("/").map(encodeURIComponent).join("/")}`;
  }

  async loadModel(pathOrUrl: string, directUrl = false, format?: string) {
    const generation = ++this.loadGeneration;
    this.callbacks.onError(null);
    this.callbacks.onProgress(0);
    this.stopAnimation();
    this.clearModel();
    const started = performance.now();
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => this.callbacks.onProgress(total ? loaded / total : null);
    const url = directUrl ? pathOrUrl : this.assetUrl(pathOrUrl);
    const extension = (format ?? pathOrUrl.split("?")[0].split(".").at(-1) ?? "glb").toLowerCase().replace(/^\./, "");
    const draco = new DRACOLoader(manager).setDecoderPath("/three-decoders/draco/");
    const ktx2 = new KTX2Loader(manager).setTranscoderPath("/three-decoders/basis/").detectSupport(this.renderer);
    try {
      let scene: THREE.Object3D;
      let animations: THREE.AnimationClip[] = [];
      if (extension === "obj") {
        const objLoader = new OBJLoader(manager);
        if (!directUrl) {
          try {
            const source = await fetch(url).then((response) => response.ok ? response.text() : Promise.reject(new Error(String(response.status))));
            const library = source.match(/^mtllib\s+(.+)$/im)?.[1]?.trim();
            if (library) {
              const materialUrl = new URL(library, new URL(url, window.location.href)).pathname;
              const materials = await new MTLLoader(manager).loadAsync(materialUrl);
              materials.preload();
              objLoader.setMaterials(materials);
            }
          } catch {
            // A auditoria estática já mostra o MTL ausente; o OBJ continua útil sem ele.
          }
        }
        scene = await objLoader.loadAsync(url);
      } else {
        const loader = new GLTFLoader(manager).setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
        const gltf = await loader.loadAsync(url);
        scene = gltf.scene;
        animations = gltf.animations;
      }
      if (generation !== this.loadGeneration) {
        disposeObject(scene);
        return;
      }
      this.installModel(scene, animations, performance.now() - started);
    } catch (error) {
      if (generation !== this.loadGeneration) return;
      this.callbacks.onError(error instanceof Error ? error.message : "Não foi possível abrir o modelo.");
      this.callbacks.onProgress(null);
    } finally {
      draco.dispose();
      ktx2.dispose();
    }
  }

  private installModel(scene: THREE.Object3D, animations: THREE.AnimationClip[], loadMs: number, normalize = true) {
    this.model = scene;
    const originalBox = new THREE.Box3().setFromObject(this.model);
    if (originalBox.isEmpty()) throw new Error("O arquivo não contém geometria visível.");
    const originalSize = originalBox.getSize(new THREE.Vector3());
    const maxDimension = Math.max(originalSize.x, originalSize.y, originalSize.z);
    const scale = normalize && Number.isFinite(maxDimension) && maxDimension > 0 ? 2 / maxDimension : 1;
    if (normalize) {
      this.model.scale.multiplyScalar(scale);
      this.model.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(this.model);
      const center = scaledBox.getCenter(new THREE.Vector3());
      this.model.position.x -= center.x;
      this.model.position.z -= center.z;
      this.model.position.y -= scaledBox.min.y;
    }
    this.model.updateMatrixWorld(true);
    this.modelStage.add(this.model);

    const finalBox = new THREE.Box3().setFromObject(this.model);
    const finalSize = finalBox.getSize(new THREE.Vector3());
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    let vertices = 0;
    let triangles = 0;
    let meshes = 0;
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      meshes += 1;
      const position = object.geometry.getAttribute("position");
      const index = object.geometry.getIndex();
      vertices += position?.count ?? 0;
      triangles += index ? index.count / 3 : (position?.count ?? 0) / 3;
      for (const material of materialList(object.material)) {
        materials.add(material);
        collectTextures(material, textures);
      }
    });
    this.staticMetrics = {
      vertices: Math.round(vertices), triangles: Math.round(triangles), meshes,
      materials: materials.size, textures: textures.size, animations: animations.length,
      bounds: [finalSize.x, finalSize.y, finalSize.z], diagonal: finalSize.length(),
      normalizationScale: scale, loadMs,
    };
    this.mixer = animations.length ? new THREE.AnimationMixer(this.model) : null;
    if (this.mixer) this.mixer.clipAction(animations[0]).play();
    this.callbacks.onAnimationState(Boolean(this.mixer), false);
    this.setBoundsVisible(this.showBounds);
    this.setCollider(this.colliderMode);
    this.fitCamera();
    this.callbacks.onProgress(1);
    this.applyDiagnostic("beauty");
    this.invalidate();
  }

  previewScene(plan: ScenePlan) {
    this.callbacks.onError(null);
    this.callbacks.onProgress(0);
    this.stopAnimation();
    this.clearModel();
    const group = new THREE.Group();
    group.name = plan.name;
    const generatedMaterial = new THREE.MeshStandardMaterial({ color: 0xb8f23d, roughness: 0.48, metalness: 0.08 });
    const structureMaterial = new THREE.MeshStandardMaterial({ color: 0x353c41, roughness: 0.9, metalness: 0 });
    const geometry = (primitive: ScenePrimitive) => {
      if (primitive === "sphere") return new THREE.SphereGeometry(0.5, 24, 16);
      if (primitive === "cylinder") return new THREE.CylinderGeometry(0.5, 0.5, 1, 24);
      if (primitive === "plane") return new THREE.PlaneGeometry(1, 1);
      return new THREE.BoxGeometry(1, 1, 1);
    };
    for (const item of plan.objects) {
      const mesh = new THREE.Mesh(geometry(item.primitive), item.kind === "structural" ? structureMaterial.clone() : generatedMaterial.clone());
      mesh.name = item.name;
      mesh.position.fromArray(item.position);
      mesh.rotation.set(...item.rotation);
      mesh.scale.fromArray(item.scale);
      mesh.castShadow = item.kind !== "structural";
      mesh.receiveShadow = true;
      mesh.userData.sceneObjectId = item.id;
      mesh.userData.generationRequired = item.generation.required;
      group.add(mesh);
    }
    for (const light of plan.lights) {
      const color = new THREE.Color(light.color);
      const source = light.type === "directional"
        ? new THREE.DirectionalLight(color, light.intensity)
        : light.type === "spot"
          ? new THREE.SpotLight(color, light.intensity, 0, Math.PI / 5, 0.45)
          : new THREE.PointLight(color, light.intensity);
      source.position.fromArray(light.position);
      group.add(source);
    }
    this.scene.background = new THREE.Color(plan.environment.background);
    this.renderer.toneMappingExposure = plan.environment.exposure;
    this.installModel(group, [], 0, false);
    this.camera.fov = plan.camera.fov;
    this.camera.position.fromArray(plan.camera.position);
    this.controls.target.fromArray(plan.camera.target);
    this.camera.near = 0.02;
    this.camera.far = 250;
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.invalidate();
  }

  async assembleScene(plan: ScenePlan, models: Record<string, string>) {
    const started = performance.now();
    const generation = ++this.loadGeneration;
    this.callbacks.onError(null);
    this.callbacks.onProgress(0);
    this.stopAnimation();
    this.clearModel();
    const group = new THREE.Group();
    group.name = plan.name;
    const entries = plan.objects.filter((item) => item.kind === "generated" && models[item.id]);
    const manager = new THREE.LoadingManager();
    let loaded = 0;
    manager.onLoad = () => this.callbacks.onProgress(entries.length ? loaded / entries.length : 1);
    const draco = new DRACOLoader(manager).setDecoderPath("/three-decoders/draco/");
    const ktx2 = new KTX2Loader(manager).setTranscoderPath("/three-decoders/basis/").detectSupport(this.renderer);
    const loader = new GLTFLoader(manager).setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
    try {
      for (const item of plan.objects) {
        if (generation !== this.loadGeneration) return;
        let object: THREE.Object3D;
        if (item.kind === "structural") {
          object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x353c41, roughness: 0.9 }));
        } else {
          const url = models[item.id];
          if (!url) continue;
          const gltf = await loader.loadAsync(url);
          object = gltf.scene;
          object.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(object);
          const size = box.getSize(new THREE.Vector3());
          const max = Math.max(size.x, size.y, size.z);
          const unitScale = max > 0 && Number.isFinite(max) ? 1 / max : 1;
          object.scale.multiplyScalar(unitScale);
          object.updateMatrixWorld(true);
          const normalized = new THREE.Box3().setFromObject(object);
          const center = normalized.getCenter(new THREE.Vector3());
          object.position.set(-center.x, -normalized.min.y, -center.z);
          loaded += 1;
          this.callbacks.onProgress(entries.length ? loaded / entries.length : 1);
        }
        const wrapper = new THREE.Group();
        wrapper.name = item.name;
        wrapper.position.fromArray(item.position);
        wrapper.rotation.set(...item.rotation);
        wrapper.scale.fromArray(item.scale);
        wrapper.userData.sceneObjectId = item.id;
        wrapper.userData.physics = item.physics;
        wrapper.add(object);
        group.add(wrapper);
      }
      for (const light of plan.lights) {
        const color = new THREE.Color(light.color);
        const source = light.type === "directional" ? new THREE.DirectionalLight(color, light.intensity) : light.type === "spot" ? new THREE.SpotLight(color, light.intensity, 0, Math.PI / 5, 0.45) : new THREE.PointLight(color, light.intensity);
        source.position.fromArray(light.position);
        group.add(source);
      }
      if (generation !== this.loadGeneration) return disposeObject(group);
      this.scene.background = new THREE.Color(plan.environment.background);
      this.renderer.toneMappingExposure = plan.environment.exposure;
      this.installModel(group, [], performance.now() - started, false);
      this.camera.fov = plan.camera.fov;
      this.camera.position.fromArray(plan.camera.position);
      this.controls.target.fromArray(plan.camera.target);
      this.camera.near = 0.02;
      this.camera.far = 250;
      this.camera.updateProjectionMatrix();
      this.controls.update();
      this.invalidate();
    } catch (error) {
      disposeObject(group);
      this.callbacks.onError(error instanceof Error ? error.message : "Falha ao montar a cena gerada.");
      this.callbacks.onProgress(null);
    } finally {
      draco.dispose();
      ktx2.dispose();
    }
  }

  private clearModel() {
    this.clearCollider();
    if (this.boundsHelper) {
      this.scene.remove(this.boundsHelper);
      this.boundsHelper.geometry.dispose();
      materialList(this.boundsHelper.material).forEach((material) => material.dispose());
      this.boundsHelper = null;
    }
    if (this.model) {
      this.restoreMaterials();
      this.modelStage.remove(this.model);
      disposeObject(this.model);
      this.model = null;
    }
    this.originals.clear();
    this.overrides.forEach((material) => material.dispose());
    this.overrides.clear();
    this.mixer = null;
  }

  fitCamera = () => {
    if (!this.model) return;
    const box = new THREE.Box3().setFromObject(this.model);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const vertical = THREE.MathUtils.degToRad(this.camera.fov);
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * this.camera.aspect);
    const distance = Math.max(sphere.radius / Math.sin(vertical / 2), sphere.radius / Math.sin(horizontal / 2)) * 1.18;
    const direction = new THREE.Vector3(1, 0.58, 1).normalize();
    this.controls.target.copy(sphere.center);
    this.camera.position.copy(sphere.center).addScaledVector(direction, distance);
    this.camera.near = Math.max(0.001, distance - sphere.radius * 1.8);
    this.camera.far = Math.max(10, distance + sphere.radius * 6);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.invalidate();
  };

  applyDiagnostic(mode: DiagnosticMode) {
    if (!this.model) return;
    this.restoreMaterials();
    if (mode === "beauty") return this.invalidate();
    this.model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      this.originals.set(object, object.material);
      let material: THREE.Material;
      if (mode === "wireframe") material = new THREE.MeshBasicMaterial({ color: 0xc6ff4a, wireframe: true });
      else if (mode === "normals") material = new THREE.MeshNormalMaterial();
      else if (mode === "uv") material = new THREE.ShaderMaterial({ vertexShader: UV_VERTEX, fragmentShader: UV_FRAGMENT });
      else {
        const source = materialList(object.material)[0] as THREE.MeshStandardMaterial;
        material = new THREE.MeshBasicMaterial({ color: source.color ?? 0xffffff, map: source.map ?? null, alphaMap: source.alphaMap ?? null, transparent: source.transparent, opacity: source.opacity });
      }
      this.overrides.add(material);
      object.material = material;
    });
    this.invalidate();
  }

  private restoreMaterials() {
    for (const [mesh, material] of this.originals) mesh.material = material;
    this.originals.clear();
    this.overrides.forEach((material) => material.dispose());
    this.overrides.clear();
  }

  setGridVisible(value: boolean) { this.grid.visible = value; this.invalidate(); }
  setAxesVisible(value: boolean) { this.axes.visible = value; this.invalidate(); }
  setBoundsVisible(value: boolean) {
    this.showBounds = value;
    if (this.boundsHelper) {
      this.scene.remove(this.boundsHelper);
      this.boundsHelper.geometry.dispose();
      materialList(this.boundsHelper.material).forEach((material) => material.dispose());
      this.boundsHelper = null;
    }
    if (value && this.model) {
      this.boundsHelper = new THREE.Box3Helper(new THREE.Box3().setFromObject(this.model), 0x9df23b);
      this.scene.add(this.boundsHelper);
    }
    this.invalidate();
  }

  private clearCollider() {
    if (!this.collider) return;
    this.scene.remove(this.collider);
    this.collider.traverse((object) => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.LineSegments)) return;
      object.geometry?.dispose();
      if (object.material) materialList(object.material).forEach((material) => material.dispose());
    });
    this.collider = null;
  }

  setCollider(mode: ColliderMode) {
    this.colliderMode = mode;
    this.clearCollider();
    if (!this.model || mode === "off") return this.invalidate();
    const box = new THREE.Box3().setFromObject(this.model);
    const color = 0x36d7ff;
    if (mode === "box") {
      this.collider = new THREE.Box3Helper(box, color);
    } else if (mode === "sphere") {
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const material = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.78, depthTest: false });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(sphere.radius, 24, 16), material);
      mesh.position.copy(sphere.center);
      this.collider = mesh;
    } else {
      const points: THREE.Vector3[] = [];
      const vertex = new THREE.Vector3();
      const meshes: THREE.Mesh[] = [];
      let totalVertices = 0;
      this.model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const position = object.geometry.getAttribute("position");
        if (!position) return;
        meshes.push(object);
        totalVertices += position.count;
      });
      const stride = Math.max(1, Math.ceil(totalVertices / 1200));
      let cursor = 0;
      for (const mesh of meshes) {
        const position = mesh.geometry.getAttribute("position");
        for (let index = 0; index < position.count; index += 1, cursor += 1) {
          if (cursor % stride) continue;
          vertex.fromBufferAttribute(position, index);
          points.push(mesh.localToWorld(vertex.clone()));
        }
      }
      try {
        if (points.length < 4) throw new Error("pontos insuficientes");
        const material = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.82, depthTest: false });
        this.collider = new THREE.Mesh(new ConvexGeometry(points), material);
      } catch {
        this.collider = new THREE.Box3Helper(box, color);
      }
    }
    if (this.collider) {
      this.collider.renderOrder = 20;
      this.scene.add(this.collider);
    }
    this.invalidate();
  }

  async setEnvironment(path: string | null, visible: boolean) {
    if (this.environment) this.environment.dispose();
    this.environment = null;
    this.scene.environment = null;
    this.scene.background = new THREE.Color(0x101316);
    if (path) {
      try {
        const url = this.assetUrl(path);
        const texture = path.toLowerCase().endsWith(".exr") ? await new EXRLoader().loadAsync(url) : await new RGBELoader().loadAsync(url);
        texture.mapping = THREE.EquirectangularReflectionMapping;
        this.environment = texture;
        this.scene.environment = texture;
        if (visible) this.scene.background = texture;
      } catch (error) {
        this.callbacks.onError(error instanceof Error ? error.message : "Falha ao carregar HDR/EXR.");
      }
    }
    this.invalidate();
  }

  setEnvironmentBackground(visible: boolean) {
    this.scene.background = visible && this.environment ? this.environment : new THREE.Color(0x101316);
    this.invalidate();
  }

  setExposure(value: number) { this.renderer.toneMappingExposure = value; this.invalidate(); }
  setProfile(profile: DeviceProfile) {
    this.profile = profile;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, PROFILE[profile].dpr));
    this.resize();
  }

  toggleAnimation() {
    if (!this.mixer) return;
    this.playing = !this.playing;
    this.clock.start();
    this.callbacks.onAnimationState(true, this.playing);
    if (this.playing) this.invalidate();
  }

  private stopAnimation() {
    this.playing = false;
    this.mixer?.stopAllAction();
    this.callbacks.onAnimationState(false, false);
  }

  capture(name: string) {
    this.render(performance.now());
    this.canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}-lab.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  }

  private resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  }

  invalidate = () => {
    if (!this.visible || this.frame !== null) return;
    this.frame = requestAnimationFrame(this.render);
  };

  private render = (time: number) => {
    this.frame = null;
    const fps = PROFILE[this.profile].fps;
    if (this.playing && time - this.lastFrame < 1000 / fps) {
      this.invalidate();
      return;
    }
    const delta = Math.min(0.05, this.clock.getDelta());
    if (this.playing) this.mixer?.update(delta);
    this.lastFrame = time;
    this.renderer.render(this.scene, this.camera);
    const info = this.renderer.info;
    if (!this.playing || time - this.lastMetricsEmit >= 250) {
      this.lastMetricsEmit = time;
      this.callbacks.onMetrics({
        ...this.staticMetrics,
        drawCalls: info.render.calls,
        frameTriangles: info.render.triangles,
        programs: info.programs?.length ?? 0,
        geometries: info.memory.geometries,
        gpuTextures: info.memory.textures,
        width: this.renderer.domElement.width,
        height: this.renderer.domElement.height,
        dpr: this.renderer.getPixelRatio(),
      });
    }
    if (this.playing) this.invalidate();
  };

  dispose() {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.controls.removeEventListener("change", this.invalidate);
    this.controls.dispose();
    this.clearModel();
    this.environment?.dispose();
    this.grid.geometry.dispose();
    materialList(this.grid.material).forEach((material) => material.dispose());
    this.axes.geometry.dispose();
    this.axes.material.dispose();
    this.renderer.dispose();
  }
}
