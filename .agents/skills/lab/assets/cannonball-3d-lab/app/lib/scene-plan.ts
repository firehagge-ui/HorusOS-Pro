export type SceneObjectKind = "generated" | "structural";
export type ScenePrimitive = "box" | "cylinder" | "sphere" | "plane";
export type PhysicsMode = "static" | "dynamic" | "kinematic";

export type SceneObjectPlan = {
  id: string;
  name: string;
  kind: SceneObjectKind;
  prompt: string;
  primitive: ScenePrimitive;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  physics: { mode: PhysicsMode; collider: "box" | "sphere" | "convex" | "mesh"; mass: number };
  generation: { required: boolean; quality: "high" | "ultra"; topology: "source" | "web"; targetPolycount: number };
};

export type ScenePlan = {
  schema: "cannonball-scene-plan/v1";
  name: string;
  prompt: string;
  createdAt: string;
  units: "meters";
  environment: { preset: "studio" | "interior" | "exterior" | "night"; exposure: number; background: string };
  camera: { fov: number; position: [number, number, number]; target: [number, number, number] };
  lights: Array<{ type: "directional" | "point" | "spot"; intensity: number; color: string; position: [number, number, number] }>;
  objects: SceneObjectPlan[];
  budget: { maxTriangles: number; maxDrawCalls: number; maxTextureMemoryMb: number };
  planner?: { provider: "claude-code" | "offline"; model?: string; subscriptionUsage: boolean };
};

type Archetype = {
  match: RegExp;
  environment: ScenePlan["environment"]["preset"];
  objects: Array<Pick<SceneObjectPlan, "name" | "prompt" | "primitive" | "position" | "scale">>;
};

const ARCHETYPES: Archetype[] = [
  {
    match: /quarto|bedroom/i,
    environment: "interior",
    objects: [
      { name: "cama", prompt: "cama completa com roupa de cama detalhada e proporções reais", primitive: "box", position: [0, 0.45, 0], scale: [2, 0.65, 2.2] },
      { name: "mesa lateral", prompt: "mesa lateral coerente com o estilo da cena", primitive: "box", position: [1.55, 0.38, 0], scale: [0.65, 0.75, 0.65] },
      { name: "luminária", prompt: "luminária de mesa com materiais PBR e cabo discreto", primitive: "cylinder", position: [1.55, 1, 0], scale: [0.3, 0.75, 0.3] },
    ],
  },
  {
    match: /sala|living|lounge/i,
    environment: "interior",
    objects: [
      { name: "sofá", prompt: "sofá de três lugares com costuras e proporções reais", primitive: "box", position: [0, 0.55, -1.25], scale: [2.8, 1.1, 0.9] },
      { name: "mesa de centro", prompt: "mesa de centro detalhada coerente com o estilo da cena", primitive: "box", position: [0, 0.35, 0.55], scale: [1.45, 0.7, 0.8] },
      { name: "poltrona", prompt: "poltrona individual com acabamento PBR", primitive: "box", position: [-2, 0.55, 0.2], scale: [0.95, 1.1, 0.95] },
    ],
  },
  {
    match: /rua|street|praça|plaza|exterior|jardim|garden/i,
    environment: "exterior",
    objects: [
      { name: "elemento principal", prompt: "objeto principal externo detalhado, escala real e materiais resistentes ao tempo", primitive: "box", position: [0, 1, 0], scale: [2, 2, 2] },
      { name: "vegetação", prompt: "conjunto de vegetação otimizada com variação natural", primitive: "sphere", position: [-2.2, 0.65, -1.5], scale: [1.2, 1.3, 1.2] },
      { name: "mobiliário externo", prompt: "mobiliário urbano coerente com a cena", primitive: "box", position: [2, 0.45, 1], scale: [1.5, 0.9, 0.55] },
    ],
  },
  {
    match: /.*/,
    environment: "studio",
    objects: [
      { name: "objeto principal", prompt: "objeto principal da cena, alta fidelidade e materiais PBR", primitive: "box", position: [0, 1, 0], scale: [2, 2, 2] },
      { name: "objeto secundário", prompt: "objeto secundário coerente em estilo e escala", primitive: "cylinder", position: [2, 0.65, 0.5], scale: [0.8, 1.3, 0.8] },
    ],
  },
];

function object(id: number, source: Archetype["objects"][number], context: string): SceneObjectPlan {
  return {
    id: `object-${id + 1}`,
    ...source,
    kind: "generated",
    prompt: `${source.prompt}. Direção artística da cena: ${context}`,
    rotation: [0, 0, 0],
    physics: { mode: "static", collider: source.primitive === "sphere" ? "sphere" : "box", mass: 0 },
    generation: { required: true, quality: "high", topology: "web", targetPolycount: 60000 },
  };
}

export function planScene(prompt: string): ScenePlan {
  const clean = prompt.trim().replace(/\s+/g, " ");
  const archetype = ARCHETYPES.find((item) => item.match.test(clean)) ?? ARCHETYPES.at(-1)!;
  const night = /noite|noturn|night|neon/i.test(clean);
  return {
    schema: "cannonball-scene-plan/v1",
    name: clean.slice(0, 52) || "Cena sem título",
    prompt: clean,
    createdAt: new Date().toISOString(),
    units: "meters",
    environment: { preset: night ? "night" : archetype.environment, exposure: night ? 0.85 : 1, background: night ? "#080b12" : "#171b1e" },
    camera: { fov: 42, position: [6, 4.2, 6], target: [0, 0.8, 0] },
    lights: night
      ? [{ type: "spot", intensity: 55, color: "#89aaff", position: [2, 5, 2] }, { type: "point", intensity: 18, color: "#ff4ad8", position: [-3, 2, -1] }]
      : [{ type: "directional", intensity: 3.2, color: "#ffffff", position: [4, 6, 5] }, { type: "point", intensity: 8, color: "#dfe8ff", position: [-3, 3, 2] }],
    objects: [
      {
        id: "structure-floor",
        name: "piso",
        kind: "structural",
        prompt: "plano estrutural de piso",
        primitive: "box",
        position: [0, -0.08, 0],
        rotation: [0, 0, 0],
        scale: [8, 0.16, 8],
        physics: { mode: "static", collider: "box", mass: 0 },
        generation: { required: false, quality: "high", topology: "web", targetPolycount: 12 },
      },
      ...archetype.objects.map((item, index) => object(index, item, clean)),
    ],
    budget: { maxTriangles: 300000, maxDrawCalls: 120, maxTextureMemoryMb: 384 },
    planner: { provider: "offline", subscriptionUsage: false },
  };
}

export function validateScenePlan(plan: ScenePlan) {
  const issues: string[] = [];
  if (!plan.prompt.trim()) issues.push("A cena precisa de uma descrição.");
  if (!plan.objects.some((item) => item.generation.required)) issues.push("O plano não possui objetos para gerar.");
  const estimated = plan.objects.reduce((total, item) => total + (item.generation.required ? item.generation.targetPolycount : 12), 0);
  if (estimated > plan.budget.maxTriangles) issues.push(`O alvo de ${estimated.toLocaleString("pt-BR")} triângulos excede o orçamento da cena.`);
  for (const item of plan.objects) {
    if (item.scale.some((value) => !Number.isFinite(value) || value <= 0)) issues.push(`${item.name}: escala inválida.`);
    if (item.generation.required && !item.prompt.trim()) issues.push(`${item.name}: prompt de geração vazio.`);
  }
  return { valid: issues.length === 0, issues, estimatedTriangles: estimated };
}
