import { Scene } from "@alipay/o3";
import { PostProcessFeature } from "./PostProcessFeature";
(Scene as any).registerFeature(PostProcessFeature);

export { PostProcessFeature };
export { PostEffectNode } from "./PostEffectNode";
export { ColorCorrectionEffect } from "./ColorCorrectionEffect";
export { DepthOfFieldEffect } from "./DepthOfFieldEffect";
export { BloomEffect } from "./BloomEffect";
export { BloomResetEffect } from "./BloomResetEffect";
export { GodraysEffect } from "./GodraysEffect";
export { addDepthPass } from "./DepthPass";
export { ScreenQuadGeometry as ScreenQuad } from "@alipay/o3";

export { SMAAEffect } from "./SMAAEffect";
export { AutoExposureEffect } from "./AutoExposure";
export { VignetteEffect } from "./VignetteEffect";
export { SSAOEffect } from "./SSAOEffect";
export { addNormalPass } from "./NormalPass";
export { addDepthTexturePass } from "./DepthTexturePass";
