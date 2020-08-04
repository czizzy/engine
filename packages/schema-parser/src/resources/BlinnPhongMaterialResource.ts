import { SchemaResource } from "./SchemaResource";
import * as o3 from "@alipay/o3";
import { AssetConfig } from "../types";
import { ResourceManager } from "@alipay/o3";

export class BlinnPhongMaterialResource extends SchemaResource {
  load(resourceManager: ResourceManager, assetConfig: AssetConfig): Promise<BlinnPhongMaterialResource> {
    return new Promise((resolve) => {
      const assetObj = new o3.BlinnPhongMaterial(assetConfig.name);
      for (let k in assetConfig.props) {
        assetObj[k] = assetConfig.props[k];
      }
      this._resource = assetObj;
      this.setMeta();
      resolve(this);
    });
  }

  setMeta() {
    if (this.resource) {
      this.meta.name = this.resource.name;
    }
  }
}
