import { SchemaResource } from "./resouces";

export interface NodeConfig {
  /**
   * 节点 id
   */
  id: string;
  /**
   * 节点在 parent 里的 index
   */
  index: number;
  /**
   * 节点名称
   */
  name: string;
  /**
   * 节点坐标
   */
  position: [number, number, number];
  /**
   * 节点旋转四元数
   */
  rotation: [number, number, number];
  /**
   * 节点缩放
   */
  scale: [number, number, number];
  /**
   * 父节点，默认为根节点
   */
  parent: string | undefined;
  /**
   * 子节点，默认为 []
   */
  children: string[];
  /**
   * abilities 默认为 []
   */
  abilities?: string[];
  /**
   * 是否激活，默认为 true
   */
  isActive?: boolean;
}

export interface Props {
  [key: string]: any | AssetProp;
}

export interface AssetProp {
  type: "asset";
  /**
   * asset id
   */
  id: string;
}
export interface AbilityConfig {
  /**
   * ability id
   */
  id: string;
  /**
   * ability 所属 node id
   */
  node: string;
  /**
   * ability type
   */
  type: string;
  /**
   * ability props
   */
  props: Props;
  /**
   * ability 在 node abilities 的 index，默认是最后一个
   */
  index: number;
}

// todo
export interface AssetConfig {
  /**
   * asset id
   */
  id?: string;
  /**
   * asset name
   */
  name: string;
  /**
   * asset type
   */
  type: string;
  /**
   * asset props
   */
  props: any;
  /**
   * asset url
   */
  url?: string;
}

export interface Schema {
  nodes: {
    [nodeId: string]: NodeConfig;
  };
  abilities: {
    [abiliId: string]: AbilityConfig;
  };
  assets: {
    [assetId: string]: AssetConfig;
  };
}

export interface ClassType<T> extends Function {
  new (...args: any[]): T;
}

export interface Options {
  canvas?: HTMLCanvasElement;
  config?: Schema;
  autoPlay?: boolean;
  onProgress?: () => {};
  local?: boolean; // 是否本地开发环境
  rhiAttr: WebGLContextAttributes & { enableCollect?: boolean };
}

export interface LoadAttachedResourceResult {
  resources: Array<SchemaResource>;
  structure: LoadAttachedResourceResultStructure;
}
interface LoadAttachedResourceResultStructure {
  index: number;
  props?: {
    [propName: string]: LoadAttachedResourceResultStructure | Array<LoadAttachedResourceResultStructure>;
  };
}
