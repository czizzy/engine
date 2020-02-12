import { Oasis } from "./Oasis";
import {
  SchemaResource,
  GLTFResource,
  PBRMaterialResource,
  TextureResource,
  ScriptResource,
  BlinnPhongMaterialResource,
  TextureCubeMapResource,
  AnimationClip,
  Animation,
  Animator
} from "./resources";
import * as o3 from "@alipay/o3";
import { AssetConfig } from "./types";
import { pluginHook } from "./plugins/PluginManager";

const RESOURCE_CLASS = {
  script: ScriptResource,
  gltf: GLTFResource,
  texture: TextureResource,
  // 'image': TextureResource,
  cubeTexture: TextureCubeMapResource,
  PBRMaterial: PBRMaterialResource,
  BlinnPhongMaterial: BlinnPhongMaterialResource,
  AnimationClip: AnimationClip,
  Animation: Animation,
  Animator: Animator
};

const RESOURCE_TYPE: Map<SchemaResource, string> = new Map();
for (const key in RESOURCE_CLASS) {
  if (RESOURCE_CLASS.hasOwnProperty(key)) {
    const element = RESOURCE_CLASS[key];
    RESOURCE_TYPE.set(element, key);
  }
}

const resourceFactory = {
  createResource(resourceManager: ResourceManager, type: string): SchemaResource {
    const ResourceConstructor = RESOURCE_CLASS[type];
    return new ResourceConstructor(resourceManager);
  }
};

export class ResourceManager {
  private resourceMap: { [id: string]: SchemaResource } = {};
  private resourceIdMap: WeakMap<SchemaResource, string> = new WeakMap();
  private resourceLoader: o3.ResourceLoader = new o3.ResourceLoader(this.oasis.engine, null);
  private maxId = 0;

  constructor(private oasis: Oasis) {}

  // 从schema中加载资源
  load(asset: AssetConfig): Promise<SchemaResource> {
    const resource = resourceFactory.createResource(this, asset.type);
    //TODO 脏代码
    const loadPromise = resource.load(this.resourceLoader, asset, this.oasis);
    this.maxId = Math.max(+asset.id, this.maxId);
    loadPromise.then(() => {
      this.resourceMap[asset.id] = resource;
      this.resourceIdMap.set(resource, asset.id);
    });
    return loadPromise;
  }

  // 新增资源
  add(asset: AssetConfig): Promise<any> {
    const resource = resourceFactory.createResource(this, asset.type);
    return new Promise(resolve => {
      //TODO 脏代码
      resource.loadWithAttachedResources(this.resourceLoader, asset, this.oasis).then(result => {
        resolve(this.getAddResourceResult(result.resources, result.structure));
      });
    });
  }

  @pluginHook({ before: "beforeResourceRemove" })
  remove(id: string): Promise<Array<string>> {
    return new Promise(resolve => {
      const resource = this.resourceMap[id];
      const result = [id];
      let hasAttachedResource = false;
      delete this.resourceMap[id];
      if (resource) {
        const attached = resource.attachedResources;
        for (let index = 0; index < attached.length; index++) {
          const attachedResource = attached[index];
          const attachedResourceId = this.resourceIdMap.get(attachedResource);
          if (attachedResourceId) {
            hasAttachedResource = true;
            this.remove(attachedResourceId).then(attachedResourceRemoveResult => {
              result.push(...attachedResourceRemoveResult);
              resolve(result);
            });
          }
        }
      }
      if (!hasAttachedResource) {
        resolve(result);
      }
    });
  }

  @pluginHook({ after: "resourceUpdated", before: "beforeResourceUpdate" })
  update(id: string, key: string, value: any) {
    const resource = this.get(id);
    if (resource) {
      resource.update(key, value);
    }
    return {
      resource,
      id,
      key,
      value
    };
  }

  updateMeta(id: string, key: string, value: any) {
    const resource = this.get(id);
    if (resource) {
      resource.updateMeta(key, value);
    }
  }

  get(id: string): SchemaResource {
    return this.resourceMap[id];
  }

  getAll(): Array<SchemaResource> {
    return Object.values(this.resourceMap);
  }

  private getAddResourceResult(resources, structure) {
    const addResourceResult: any = {};
    const resource = resources[structure.index];
    const id = `${++this.maxId}`;
    this.resourceMap[id] = resource;
    this.resourceIdMap.set(resource, id);

    addResourceResult.id = this.maxId;
    addResourceResult.type = RESOURCE_TYPE.get(resource.constructor);
    addResourceResult.props = {};
    for (const key in structure.props) {
      if (structure.props.hasOwnProperty(key)) {
        const element = structure.props[key];
        if (element) {
          if (Array.isArray(element)) {
            addResourceResult.props[key] = element.map(child => this.getAddResourceResult(resources, child));
          } else {
            addResourceResult.props[key] = this.getAddResourceResult(resources, element);
          }
        }
      }
    }
    return addResourceResult;
  }

  get isLocal(): boolean {
    return this.oasis.options.local;
  }
}
