import { raycast } from "./cast";
import { MeshRenderer } from "@alipay/o3-mesh";

type RendererArray = Array<MeshRenderer>;

export class Caster {
  public rendererGroup: RendererArray;
  public ray;
  public constructor() {
    this.rendererGroup = [];
  }

  setTarget(node) {
    this.getAllMeshRender(node);
  }

  setRay(ray) {
    this.ray = ray;
  }

  intersect() {
    if (!this.ray) {
      console.error("需要设置射线");
    }
    const group = this.rendererGroup;
    let intersection = [];
    for (let i = 0; i < group.length; i += 1) {
      const intersect = raycast(group[i], this.ray);
      if (intersect) {
        intersection = intersection.concat(intersect);
      }
    }
    return intersection;
  }

  getAllMeshRender(node) {
    const meshRenderer = node.getComponent(MeshRenderer);
    if (meshRenderer) {
      this.rendererGroup.push(meshRenderer);
    }
    if (node.childCount > 0) {
      for (let i = 0; i < node.childCount; i += 1) {
        this.getAllMeshRender(node._children[i]);
      }
    }
  }
}
