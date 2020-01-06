import { AssetObject } from "@alipay/o3-core";

/**
 * Data for an animation, set of Samples and Channels
 * @extends AssetObject
 */
export class Animator extends AssetObject {
  _keyFrames: any;
  constructor(name: string, keyFrames) {
    super(name);
    this.keyFrames = keyFrames;
  }
  get keyFrames() {
    return this._keyFrames;
  }
  set keyFrames(keyFrames) {
    this._keyFrames = keyFrames;
  }
}
