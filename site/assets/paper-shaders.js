/* Paper Shaders (liquid metal) vendorizado de @paper-design/shaders.
   Motor original, sem React, empacotado como script classico (funciona em file://).
   Fonte: https://github.com/paper-design/shaders  */
(function(){
"use strict";
const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`;

const liquidMetalFragmentShader = "#version 300 es\nprecision mediump float;\n\nuniform sampler2D u_image;\nuniform float u_imageAspectRatio;\n\nuniform vec2 u_resolution;\nuniform float u_time;\n\nuniform vec4 u_colorBack;\nuniform vec4 u_colorTint;\n\nuniform float u_softness;\nuniform float u_repetition;\nuniform float u_shiftRed;\nuniform float u_shiftBlue;\nuniform float u_distortion;\nuniform float u_contour;\nuniform float u_angle;\n\nuniform float u_shape;\nuniform bool u_isImage;\n\nin vec2 v_objectUV;\nin vec2 v_responsiveUV;\nin vec2 v_responsiveBoxGivenSize;\nin vec2 v_imageUV;\n\nout vec4 fragColor;\n\n\n#define TWO_PI 6.28318530718\n#define PI 3.14159265358979323846\n\n\nvec2 rotate(vec2 uv, float th) {\n  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;\n}\n\n\nvec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187, 0.366025403784439,\n    -0.577350269189626, 0.024390243902439);\n  vec2 i = floor(v + dot(v, C.yy));\n  vec2 x0 = v - i + dot(i, C.xx);\n  vec2 i1;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod(i, 289.0);\n  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))\n    + i.x + vec3(0.0, i1.x, 1.0));\n  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),\n      dot(x12.zw, x12.zw)), 0.0);\n  m = m * m;\n  m = m * m;\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);\n  vec3 g;\n  g.x = a0.x * x0.x + h.x * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n\nfloat getColorChanges(float c1, float c2, float stripe_p, vec3 w, float blur, float bump, float tint) {\n\n  float ch = mix(c2, c1, smoothstep(.0, 2. * blur, stripe_p));\n\n  float border = w[0];\n  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));\n\n  if (u_isImage == true) {\n    bump = smoothstep(.2, .8, bump);\n  }\n  border = w[0] + .4 * (1. - bump) * w[1];\n  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));\n\n  border = w[0] + .5 * (1. - bump) * w[1];\n  ch = mix(ch, c2, smoothstep(border, border + 2. * blur, stripe_p));\n\n  border = w[0] + w[1];\n  ch = mix(ch, c1, smoothstep(border, border + 2. * blur, stripe_p));\n\n  float gradient_t = (stripe_p - w[0] - w[1]) / w[2];\n  float gradient = mix(c1, c2, smoothstep(0., 1., gradient_t));\n  ch = mix(ch, gradient, smoothstep(border, border + .5 * blur, stripe_p));\n\n  // Tint color is applied with color burn blending\n  ch = mix(ch, 1. - min(1., (1. - ch) / max(tint, 0.0001)), u_colorTint.a);\n  return ch;\n}\n\nfloat getImgFrame(vec2 uv, float th) {\n  float frame = 1.;\n  frame *= smoothstep(0., th, uv.y);\n  frame *= 1.0 - smoothstep(1. - th, 1., uv.y);\n  frame *= smoothstep(0., th, uv.x);\n  frame *= 1.0 - smoothstep(1. - th, 1., uv.x);\n  return frame;\n}\n\nfloat blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {\n  vec2 texel = 1.0 / vec2(textureSize(tex, 0));\n  vec2 r = radius * texel;\n\n  float w1 = 1.0, w2 = 2.0, w4 = 4.0;\n  float norm = 16.0;\n  float sum = w4 * centerSample;\n\n  sum += w2 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;\n  sum += w2 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;\n  sum += w2 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;\n  sum += w2 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;\n\n  sum += w1 * textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;\n  sum += w1 * textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;\n  sum += w1 * textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;\n  sum += w1 * textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;\n\n  return sum / norm;\n}\n\nfloat lst(float edge0, float edge1, float x) {\n  return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);\n}\n\nvoid main() {\n\n  const float firstFrameOffset = 2.8;\n  float t = .3 * (u_time + firstFrameOffset);\n\n  vec2 uv = v_imageUV;\n  vec2 dudx = dFdx(v_imageUV);\n  vec2 dudy = dFdy(v_imageUV);\n  vec4 img = textureGrad(u_image, uv, dudx, dudy);\n\n  if (u_isImage == false) {\n    uv = v_objectUV + .5;\n    uv.y = 1. - uv.y;\n  }\n\n  float cycleWidth = u_repetition;\n  float edge = 0.;\n  float contOffset = 1.;\n\n  vec2 rotatedUV = uv - vec2(.5);\n  float angle = (-u_angle + 70.) * PI / 180.;\n  float cosA = cos(angle);\n  float sinA = sin(angle);\n  rotatedUV = vec2(\n  rotatedUV.x * cosA - rotatedUV.y * sinA,\n  rotatedUV.x * sinA + rotatedUV.y * cosA\n  ) + vec2(.5);\n\n  if (u_isImage == true) {\n    float edgeRaw = img.r;\n    edge = blurEdge3x3(u_image, uv, dudx, dudy, 6., edgeRaw);\n    edge = pow(edge, 1.6);\n    edge *= mix(0.0, 1.0, smoothstep(0.0, 0.4, u_contour));\n  } else {\n    if (u_shape < 1.) {\n      // full-fill on canvas\n      vec2 borderUV = v_responsiveUV + .5;\n      float ratio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;\n      vec2 mask = min(borderUV, 1. - borderUV);\n      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));\n      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);\n      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);\n      maskX = pow(maskX, .25);\n      maskY = pow(maskY, .25);\n      edge = clamp(1. - maskX * maskY, 0., 1.);\n\n      uv = v_responsiveUV;\n      if (ratio > 1.) {\n        uv.y /= ratio;\n      } else {\n        uv.x *= ratio;\n      }\n      uv += .5;\n      uv.y = 1. - uv.y;\n\n      cycleWidth *= 2.;\n      contOffset = 1.5;\n\n    } else if (u_shape < 2.) {\n      // circle\n      vec2 shapeUV = uv - .5;\n      shapeUV *= .67;\n      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);\n    } else if (u_shape < 3.) {\n      // daisy\n      vec2 shapeUV = uv - .5;\n      shapeUV *= 1.68;\n\n      float r = length(shapeUV) * 2.;\n      float a = atan(shapeUV.y, shapeUV.x) + .2;\n      r *= (1. + .05 * sin(3. * a + 2. * t));\n      float f = abs(cos(a * 3.));\n      edge = smoothstep(f, f + .7, r);\n      edge *= edge;\n\n      uv *= .8;\n      cycleWidth *= 1.6;\n\n    } else if (u_shape < 4.) {\n      // diamond\n      vec2 shapeUV = uv - .5;\n      shapeUV = rotate(shapeUV, .25 * PI);\n      shapeUV *= 1.42;\n      shapeUV += .5;\n      vec2 mask = min(shapeUV, 1. - shapeUV);\n      vec2 pixel_thickness = vec2(.15);\n      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);\n      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);\n      maskX = pow(maskX, .25);\n      maskY = pow(maskY, .25);\n      edge = clamp(1. - maskX * maskY, 0., 1.);\n    } else if (u_shape < 5.) {\n      // metaballs\n      vec2 shapeUV = uv - .5;\n      shapeUV *= 1.3;\n      edge = 0.;\n      for (int i = 0; i < 5; i++) {\n        float fi = float(i);\n        float speed = 1.5 + 2./3. * sin(fi * 12.345);\n        float angle = -fi * 1.5;\n        vec2 dir1 = vec2(cos(angle), sin(angle));\n        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));\n        vec2 traj = .4 * (dir1 * sin(t * speed + fi * 1.23) + dir2 * cos(t * (speed * 0.7) + fi * 2.17));\n        float d = length(shapeUV + traj);\n        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);\n      }\n      edge = 1. - smoothstep(.65, .9, edge);\n      edge = pow(edge, 4.);\n    }\n\n    edge = mix(smoothstep(.9 - 2. * fwidth(edge), .9, edge), edge, smoothstep(0.0, 0.4, u_contour));\n\n  }\n\n  float opacity = 0.;\n  if (u_isImage == true) {\n    opacity = img.g;\n    float frame = getImgFrame(v_imageUV, 0.);\n    opacity *= frame;\n  } else {\n    opacity = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);\n    if (u_shape < 2.) {\n      edge = 1.2 * edge;\n    } else if (u_shape < 5.) {\n      edge = 1.8 * pow(edge, 1.5);\n    }\n  }\n\n  float diagBLtoTR = rotatedUV.x - rotatedUV.y;\n  float diagTLtoBR = rotatedUV.x + rotatedUV.y;\n\n  vec3 color = vec3(0.);\n  vec3 color1 = vec3(.98, 0.98, 1.);\n  vec3 color2 = vec3(.1, .1, .1 + .1 * smoothstep(.7, 1.3, diagTLtoBR));\n\n  vec2 grad_uv = uv - .5;\n\n  float dist = length(grad_uv + vec2(0., .2 * diagBLtoTR));\n  grad_uv = rotate(grad_uv, (.25 - .2 * diagBLtoTR) * PI);\n  float direction = grad_uv.x;\n\n  float bump = pow(1.8 * dist, 1.2);\n  bump = 1. - bump;\n  bump *= pow(uv.y, .3);\n\n\n  float thin_strip_1_ratio = .12 / cycleWidth * (1. - .4 * bump);\n  float thin_strip_2_ratio = .07 / cycleWidth * (1. + .4 * bump);\n  float wide_strip_ratio = (1. - thin_strip_1_ratio - thin_strip_2_ratio);\n\n  float thin_strip_1_width = cycleWidth * thin_strip_1_ratio;\n  float thin_strip_2_width = cycleWidth * thin_strip_2_ratio;\n\n  float noise = snoise(uv - t);\n\n  edge += (1. - edge) * u_distortion * noise;\n\n  direction += diagBLtoTR;\n  float contour = 0.;\n  direction -= 2. * noise * diagBLtoTR * (smoothstep(0., 1., edge) * (1.0 - smoothstep(0., 1., edge)));\n  direction *= mix(1., 1. - edge, smoothstep(.5, 1., u_contour));\n  direction -= 1.7 * edge * smoothstep(.5, 1., u_contour);\n  direction += .2 * pow(u_contour, 4.) * (1.0 - smoothstep(0., 1., edge));\n\n  bump *= clamp(pow(uv.y, .1), .3, 1.);\n  direction *= (.1 + (1.1 - edge) * bump);\n\n  direction *= (.4 + .6 * (1.0 - smoothstep(.5, 1., edge)));\n  direction += .18 * (smoothstep(.1, .2, uv.y) * (1.0 - smoothstep(.2, .4, uv.y)));\n  direction += .03 * (smoothstep(.1, .2, 1. - uv.y) * (1.0 - smoothstep(.2, .4, 1. - uv.y)));\n\n  direction *= (.5 + .5 * pow(uv.y, 2.));\n  direction *= cycleWidth;\n  direction -= t;\n\n\n  float colorDispersion = (1. - bump);\n  colorDispersion = clamp(colorDispersion, 0., 1.);\n  float dispersionRed = colorDispersion;\n  dispersionRed += .03 * bump * noise;\n  dispersionRed += 5. * (smoothstep(-.1, .2, uv.y) * (1.0 - smoothstep(.1, .5, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, 1., bump)));\n  dispersionRed -= diagBLtoTR;\n\n  float dispersionBlue = colorDispersion;\n  dispersionBlue *= 1.3;\n  dispersionBlue += (smoothstep(0., .4, uv.y) * (1.0 - smoothstep(.1, .8, uv.y))) * (smoothstep(.4, .6, bump) * (1.0 - smoothstep(.4, .8, bump)));\n  dispersionBlue -= .2 * edge;\n\n  dispersionRed *= (u_shiftRed / 20.);\n  dispersionBlue *= (u_shiftBlue / 20.);\n\n  float blur = 0.;\n  float rExtraBlur = 0.;\n  float gExtraBlur = 0.;\n  if (u_isImage == true) {\n    float softness = 0.05 * u_softness;\n    blur = softness + .5 * smoothstep(1., 10., u_repetition) * smoothstep(.0, 1., edge);\n    float smallCanvasT = 1.0 - smoothstep(100., 500., min(u_resolution.x, u_resolution.y));\n    blur += smallCanvasT * smoothstep(.0, 1., edge);\n    rExtraBlur = softness * (0.05 + .1 * (u_shiftRed / 20.) * bump);\n    gExtraBlur = softness * 0.05 / max(0.001, abs(1. - diagBLtoTR));\n  } else {\n    blur = u_softness / 15. + .3 * contour;\n  }\n\n  vec3 w = vec3(thin_strip_1_width, thin_strip_2_width, wide_strip_ratio);\n  w[1] -= .02 * smoothstep(.0, 1., edge + bump);\n  float stripe_r = fract(direction + dispersionRed);\n  float r = getColorChanges(color1.r, color2.r, stripe_r, w, blur + fwidth(stripe_r) + rExtraBlur, bump, u_colorTint.r);\n  float stripe_g = fract(direction);\n  float g = getColorChanges(color1.g, color2.g, stripe_g, w, blur + fwidth(stripe_g) + gExtraBlur, bump, u_colorTint.g);\n  float stripe_b = fract(direction - dispersionBlue);\n  float b = getColorChanges(color1.b, color2.b, stripe_b, w, blur + fwidth(stripe_b), bump, u_colorTint.b);\n\n  color = vec3(r, g, b);\n  color *= opacity;\n\n  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;\n  color = color + bgColor * (1. - opacity);\n  opacity = opacity + u_colorBack.a * (1. - opacity);\n\n  \n  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);\n\n\n  fragColor = vec4(color, opacity);\n}\n";

const DEFAULT_MAX_PIXEL_COUNT = 1920 * 1080 * 4;
class ShaderMount {
  parentElement;
  canvasElement;
  gl;
  program = null;
  uniformLocations = {};
  /** The fragment shader that we are using */
  fragmentShader;
  /** Stores the RAF for the render loop */
  rafId = null;
  /** Time of the last rendered frame */
  lastRenderTime = 0;
  /** Total time that we have played any animation, passed as a uniform to the shader for time-based VFX */
  currentFrame = 0;
  /** The speed that we progress through animation time (multiplies by delta time every update). Allows negatives to play in reverse. If set to 0, rAF will stop entirely so static shaders have no recurring performance costs */
  speed = 0;
  /** Actual speed used that accounts for visibility: we pause the shader if the tab is hidden or the element out of the viewport */
  currentSpeed = 0;
  /** Uniforms that are provided by the user for the specific shader being mounted (not including uniforms that this Mount adds, like time and resolution) */
  providedUniforms;
  /** Names of the uniforms that should have mipmaps generated for them */
  mipmaps = [];
  /** Just a sanity check to make sure frames don't run after we're disposed */
  hasBeenDisposed = false;
  /** If the resolution of the canvas has changed since the last render */
  resolutionChanged = true;
  /** Store textures that are provided by the user */
  textures = /* @__PURE__ */ new Map();
  minPixelRatio;
  maxPixelCount;
  isSafari = isSafari();
  uniformCache = {};
  textureUnitMap = /* @__PURE__ */ new Map();
  ownerDocument;
  constructor(parentElement, fragmentShader, uniforms, webGlContextAttributes, speed = 0, frame = 0, minPixelRatio = 2, maxPixelCount = DEFAULT_MAX_PIXEL_COUNT, mipmaps = []) {
    if (parentElement?.nodeType === 1) {
      this.parentElement = parentElement;
    } else {
      throw new Error("Paper Shaders: parent element must be an HTMLElement");
    }
    this.ownerDocument = parentElement.ownerDocument;
    if (!this.ownerDocument.querySelector("style[data-paper-shader]")) {
      const styleElement = this.ownerDocument.createElement("style");
      styleElement.innerHTML = defaultStyle;
      styleElement.setAttribute("data-paper-shader", "");
      this.ownerDocument.head.prepend(styleElement);
    }
    const canvasElement = this.ownerDocument.createElement("canvas");
    this.canvasElement = canvasElement;
    this.parentElement.prepend(canvasElement);
    this.fragmentShader = fragmentShader;
    this.providedUniforms = uniforms;
    this.mipmaps = mipmaps;
    this.currentFrame = frame;
    this.minPixelRatio = minPixelRatio;
    this.maxPixelCount = maxPixelCount;
    const gl = canvasElement.getContext("webgl2", webGlContextAttributes);
    if (!gl) {
      throw new Error("Paper Shaders: WebGL is not supported in this browser");
    }
    this.gl = gl;
    this.initProgram();
    this.setupPositionAttribute();
    this.setupUniforms();
    this.setUniformValues(this.providedUniforms);
    this.setupResizeObserver();
    visualViewport?.addEventListener("resize", this.handleVisualViewportChange);
    this.setupIntersectionObserver();
    this.setSpeed(speed);
    this.parentElement.setAttribute("data-paper-shader", "");
    this.parentElement.paperShaderMount = this;
    this.ownerDocument.addEventListener("visibilitychange", this.handleDocumentVisibilityChange);
  }
  initProgram = () => {
    const program = createProgram(this.gl, vertexShaderSource, this.fragmentShader);
    if (!program) return;
    this.program = program;
  };
  setupPositionAttribute = () => {
    const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
  };
  setupUniforms = () => {
    const uniformLocations = {
      u_time: this.gl.getUniformLocation(this.program, "u_time"),
      u_pixelRatio: this.gl.getUniformLocation(this.program, "u_pixelRatio"),
      u_resolution: this.gl.getUniformLocation(this.program, "u_resolution")
    };
    Object.entries(this.providedUniforms).forEach(([key, value]) => {
      uniformLocations[key] = this.gl.getUniformLocation(this.program, key);
      if (value instanceof HTMLImageElement) {
        const aspectRatioUniformName = `${key}AspectRatio`;
        uniformLocations[aspectRatioUniformName] = this.gl.getUniformLocation(this.program, aspectRatioUniformName);
      }
    });
    this.uniformLocations = uniformLocations;
  };
  /**
   * The scale that we should render at.
   * - Used to target 2x rendering even on 1x screens for better antialiasing
   * - Prevents the virtual resolution from going beyond the maximum resolution
   * - Accounts for the page zoom level so we render in physical device pixels rather than CSS pixels
   */
  renderScale = 1;
  parentWidth = 0;
  parentHeight = 0;
  parentDevicePixelWidth = 0;
  parentDevicePixelHeight = 0;
  devicePixelsSupported = false;
  intersectionObserver = null;
  isInViewport = true;
  resizeObserver = null;
  setupResizeObserver = () => {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry?.borderBoxSize[0]) {
        const physicalPixelSize = entry.devicePixelContentBoxSize?.[0];
        if (physicalPixelSize !== void 0) {
          this.devicePixelsSupported = true;
          this.parentDevicePixelWidth = physicalPixelSize.inlineSize;
          this.parentDevicePixelHeight = physicalPixelSize.blockSize;
        }
        this.parentWidth = entry.borderBoxSize[0].inlineSize;
        this.parentHeight = entry.borderBoxSize[0].blockSize;
      }
      this.handleResize();
    });
    this.resizeObserver.observe(this.parentElement);
  };
  setupIntersectionObserver = () => {
    const view = this.ownerDocument.defaultView;
    if (!view?.IntersectionObserver) return;
    this.intersectionObserver = new view.IntersectionObserver(([entry]) => {
      this.isInViewport = entry?.isIntersecting ?? true;
      this.updateCurrentSpeed();
    });
    this.intersectionObserver.observe(this.parentElement);
  };
  // Visual viewport resize handler, mainly used to react to browser zoom changes.
  // Resize observer by itself does not react to pinch zoom, and although it usually
  // reacts to classic browser zoom, it's not guaranteed in edge cases.
  // Since timing between visual viewport changes and resize observer is complex
  // and because we'd like to know the device pixel sizes of elements, we just restart
  // the observer to get a guaranteed fresh callback regardless if it would have triggered or not.
  handleVisualViewportChange = () => {
    this.resizeObserver?.disconnect();
    this.setupResizeObserver();
  };
  /** Resize handler for when the container div changes size or the max pixel count changes and we want to resize our canvas to match */
  handleResize = () => {
    let targetPixelWidth = 0;
    let targetPixelHeight = 0;
    const dpr = Math.max(1, window.devicePixelRatio);
    const pinchZoom = visualViewport?.scale ?? 1;
    if (this.devicePixelsSupported) {
      const scaleToMeetMinPixelRatio = Math.max(1, this.minPixelRatio / dpr);
      targetPixelWidth = this.parentDevicePixelWidth * scaleToMeetMinPixelRatio * pinchZoom;
      targetPixelHeight = this.parentDevicePixelHeight * scaleToMeetMinPixelRatio * pinchZoom;
    } else {
      let targetRenderScale = Math.max(dpr, this.minPixelRatio) * pinchZoom;
      if (this.isSafari) {
        const zoomLevel = bestGuessBrowserZoom(this.ownerDocument);
        targetRenderScale *= Math.max(1, zoomLevel);
      }
      targetPixelWidth = Math.round(this.parentWidth) * targetRenderScale;
      targetPixelHeight = Math.round(this.parentHeight) * targetRenderScale;
    }
    const maxPixelCountHeadroom = Math.sqrt(this.maxPixelCount) / Math.sqrt(targetPixelWidth * targetPixelHeight);
    const scaleToMeetMaxPixelCount = Math.min(1, maxPixelCountHeadroom);
    const newWidth = Math.round(targetPixelWidth * scaleToMeetMaxPixelCount);
    const newHeight = Math.round(targetPixelHeight * scaleToMeetMaxPixelCount);
    const newRenderScale = newWidth / Math.round(this.parentWidth);
    if (this.canvasElement.width !== newWidth || this.canvasElement.height !== newHeight || this.renderScale !== newRenderScale) {
      this.renderScale = newRenderScale;
      this.canvasElement.width = newWidth;
      this.canvasElement.height = newHeight;
      this.resolutionChanged = true;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      this.render(performance.now());
    }
  };
  render = (currentTime) => {
    if (this.hasBeenDisposed) return;
    if (this.program === null) {
      console.warn("Tried to render before program or gl was initialized");
      return;
    }
    const dt = currentTime - this.lastRenderTime;
    this.lastRenderTime = currentTime;
    if (this.currentSpeed !== 0) {
      this.currentFrame += dt * this.currentSpeed;
    }
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.uniformLocations.u_time, this.currentFrame * 1e-3);
    if (this.resolutionChanged) {
      this.gl.uniform2f(this.uniformLocations.u_resolution, this.gl.canvas.width, this.gl.canvas.height);
      this.gl.uniform1f(this.uniformLocations.u_pixelRatio, this.renderScale);
      this.resolutionChanged = false;
    }
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    if (this.currentSpeed !== 0) {
      this.requestRender();
    } else {
      this.rafId = null;
    }
  };
  requestRender = () => {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(this.render);
  };
  /** Creates a texture from an image and sets it into a uniform value */
  setTextureUniform = (uniformName, image) => {
    if (!image.complete || image.naturalWidth === 0) {
      throw new Error(`Paper Shaders: image for uniform ${uniformName} must be fully loaded`);
    }
    const existingTexture = this.textures.get(uniformName);
    if (existingTexture) {
      this.gl.deleteTexture(existingTexture);
    }
    if (!this.textureUnitMap.has(uniformName)) {
      this.textureUnitMap.set(uniformName, this.textureUnitMap.size);
    }
    const textureUnit = this.textureUnitMap.get(uniformName);
    this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
    if (this.mipmaps.includes(uniformName)) {
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
    }
    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR || texture === null) {
      console.error("Paper Shaders: WebGL error when uploading texture:", error);
      return;
    }
    this.textures.set(uniformName, texture);
    const location = this.uniformLocations[uniformName];
    if (location) {
      this.gl.uniform1i(location, textureUnit);
      const aspectRatioUniformName = `${uniformName}AspectRatio`;
      const aspectRatioLocation = this.uniformLocations[aspectRatioUniformName];
      if (aspectRatioLocation) {
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        this.gl.uniform1f(aspectRatioLocation, aspectRatio);
      }
    }
  };
  /** Utility: recursive equality test for all the uniforms */
  areUniformValuesEqual = (a, b) => {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
      return a.every((val, i) => this.areUniformValuesEqual(val, b[i]));
    }
    return false;
  };
  /** Sets the provided uniform values into the WebGL program, can be a partial list of uniforms that have changed */
  setUniformValues = (updatedUniforms) => {
    this.gl.useProgram(this.program);
    Object.entries(updatedUniforms).forEach(([key, value]) => {
      let cacheValue = value;
      if (value instanceof HTMLImageElement) {
        cacheValue = `${value.src.slice(0, 200)}|${value.naturalWidth}x${value.naturalHeight}`;
      }
      if (this.areUniformValuesEqual(this.uniformCache[key], cacheValue)) return;
      this.uniformCache[key] = cacheValue;
      const location = this.uniformLocations[key];
      if (!location) {
        console.warn(`Uniform location for ${key} not found`);
        return;
      }
      if (value instanceof HTMLImageElement) {
        this.setTextureUniform(key, value);
      } else if (Array.isArray(value)) {
        let flatArray = null;
        let valueLength = null;
        if (value[0] !== void 0 && Array.isArray(value[0])) {
          const firstChildLength = value[0].length;
          if (value.every((arr) => arr.length === firstChildLength)) {
            flatArray = value.flat();
            valueLength = firstChildLength;
          } else {
            console.warn(`All child arrays must be the same length for ${key}`);
            return;
          }
        } else {
          flatArray = value;
          valueLength = flatArray.length;
        }
        switch (valueLength) {
          case 2:
            this.gl.uniform2fv(location, flatArray);
            break;
          case 3:
            this.gl.uniform3fv(location, flatArray);
            break;
          case 4:
            this.gl.uniform4fv(location, flatArray);
            break;
          case 9:
            this.gl.uniformMatrix3fv(location, false, flatArray);
            break;
          case 16:
            this.gl.uniformMatrix4fv(location, false, flatArray);
            break;
          default:
            console.warn(`Unsupported uniform array length: ${valueLength}`);
        }
      } else if (typeof value === "number") {
        this.gl.uniform1f(location, value);
      } else if (typeof value === "boolean") {
        this.gl.uniform1i(location, value ? 1 : 0);
      } else {
        console.warn(`Unsupported uniform type for ${key}: ${typeof value}`);
      }
    });
  };
  /** Gets the current total animation time from 0ms */
  getCurrentFrame = () => {
    return this.currentFrame;
  };
  /** Set a frame to get a deterministic result, frames are literally just milliseconds from zero since the animation started */
  setFrame = (newFrame) => {
    this.currentFrame = newFrame;
    this.lastRenderTime = performance.now();
    this.render(performance.now());
  };
  /** Set an animation speed (or 0 to stop animation) */
  setSpeed = (newSpeed = 1) => {
    this.speed = newSpeed;
    this.updateCurrentSpeed();
  };
  /** Apply the target speed, pausing (0) while the tab is hidden or the element is out of the viewport */
  updateCurrentSpeed = () => {
    this.setCurrentSpeed(this.ownerDocument.hidden || !this.isInViewport ? 0 : this.speed);
  };
  setCurrentSpeed = (newSpeed) => {
    this.currentSpeed = newSpeed;
    if (this.rafId === null && newSpeed !== 0) {
      this.lastRenderTime = performance.now();
      this.rafId = requestAnimationFrame(this.render);
    }
    if (this.rafId !== null && newSpeed === 0) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };
  /** Set the maximum pixel count for the shader, this will limit the number of pixels that will be rendered */
  setMaxPixelCount = (newMaxPixelCount = DEFAULT_MAX_PIXEL_COUNT) => {
    this.maxPixelCount = newMaxPixelCount;
    this.handleResize();
  };
  /** Set the minimum pixel ratio for the shader */
  setMinPixelRatio = (newMinPixelRatio = 2) => {
    this.minPixelRatio = newMinPixelRatio;
    this.handleResize();
  };
  /** Update the uniforms that are provided by the outside shader, can be a partial set with only the uniforms that have changed */
  setUniforms = (newUniforms) => {
    this.setUniformValues(newUniforms);
    this.providedUniforms = { ...this.providedUniforms, ...newUniforms };
    this.render(performance.now());
  };
  handleDocumentVisibilityChange = () => {
    this.updateCurrentSpeed();
  };
  /** Dispose of the shader mount, cleaning up all of the WebGL resources */
  dispose = () => {
    this.hasBeenDisposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.gl && this.program) {
      this.textures.forEach((texture) => {
        this.gl.deleteTexture(texture);
      });
      this.textures.clear();
      this.gl.deleteProgram(this.program);
      this.program = null;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
      this.gl.getError();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    visualViewport?.removeEventListener("resize", this.handleVisualViewportChange);
    this.ownerDocument.removeEventListener("visibilitychange", this.handleDocumentVisibilityChange);
    this.uniformLocations = {};
    this.canvasElement.remove();
    delete this.parentElement.paperShaderMount;
  };
}
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function createProgram(gl, vertexShaderSource2, fragmentShaderSource) {
  const format = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
  const precision = format ? format.precision : null;
  if (precision && precision < 23) {
    vertexShaderSource2 = vertexShaderSource2.replace(/precision\s+(lowp|mediump)\s+float;/g, "precision highp float;");
    fragmentShaderSource = fragmentShaderSource.replace(/precision\s+(lowp|mediump)\s+float/g, "precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g, "$1 highp $3");
  }
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource2);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}
const defaultStyle = `@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;
function isPaperShaderElement(element) {
  return "paperShaderMount" in element;
}
function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android");
}
function bestGuessBrowserZoom(doc) {
  const viewportScale = visualViewport?.scale ?? 1;
  const viewportWidth = visualViewport?.width ?? window.innerWidth;
  const scrollbarWidth = window.innerWidth - doc.documentElement.clientWidth;
  const innerWidth = viewportScale * viewportWidth + scrollbarWidth;
  const ratio = outerWidth / innerWidth;
  const zoomPercentageRounded = Math.round(100 * ratio);
  if (zoomPercentageRounded % 5 === 0) {
    return zoomPercentageRounded / 100;
  }
  if (zoomPercentageRounded === 33) {
    return 1 / 3;
  }
  if (zoomPercentageRounded === 67) {
    return 2 / 3;
  }
  if (zoomPercentageRounded === 133) {
    return 4 / 3;
  }
  return ratio;
}

window.PaperShaders = { ShaderMount: ShaderMount, liquidMetalFragmentShader: liquidMetalFragmentShader };
})();
