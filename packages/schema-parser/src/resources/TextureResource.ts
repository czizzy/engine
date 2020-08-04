import { SchemaResource } from "./SchemaResource";
import * as o3 from "@alipay/o3";
import { AssetConfig } from "../types";
import { Oasis } from "../Oasis";
import { compressedTextureLoadOrder } from "../utils";
import { ResourceManager } from "@alipay/o3";

export class TextureResource extends SchemaResource {
  load(resourceManager: ResourceManager, assetConfig: AssetConfig, oasis: Oasis): Promise<TextureResource> {
    return new Promise((resolve, reject) => {
      let url: string;
      if (this.resourceManager.useCompressedTexture && assetConfig?.props?.compression?.compressions.length) {
        const rhi = oasis.engine._hardwareRenderer;
        const compressions = assetConfig.props.compression.compressions;
        compressions.sort((a: any, b: any) => compressedTextureLoadOrder[a.type] - compressedTextureLoadOrder[b.type]);
        for (let i = 0; i < compressions.length; i++) {
          const compression = compressions[i];
          if (compression.container === "ktx" && rhi.canIUse(o3.GLCapabilityType[compression.type])) {
            url = compression.url;
            break;
          }
        }
      }

      url = url ?? assetConfig.url;

      resourceManager.load(url).then((res) => {
        this._resource = res;
        resolve(this);
      });
    });
  }

  setMeta() {
    if (this.resource) {
      this._meta.name = this.resource.name;
      if (this.resource.image) {
        this._meta.url = this.resource.image.src;
      }
    }
  }
}
