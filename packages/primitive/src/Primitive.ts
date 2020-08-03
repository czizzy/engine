import { DrawMode } from "@alipay/o3-base";
import { AssetObject } from "@alipay/o3-core";
import { BoundingSphere, OBB } from "@alipay/o3-bounding-info";
import { Matrix4 } from "@alipay/o3-math/types/type";
import { vec3 } from "@alipay/o3-math";
import { BufferAttribute } from "./index";

let primitiveID = 0;

/**
 * primitive(triangles, lines) data, vbo+indices, equal glTF meshes.primitives define
 * @class
 * @private
 */
export class Primitive extends AssetObject {
  public readonly id: number;
  public mode: DrawMode = DrawMode.TRIANGLES;

  vertexAttributes = {};
  vertexBuffers = [];
  public vertexCount: number = 0;

  indexBuffers = [];
  public indexNeedUpdate: boolean = false;

  public material = null;
  public materialIndex: number;
  public targets: any[] = [];
  public boundingBox: OBB = null;
  public boundingSphere: BoundingSphere = null;
  public isInFrustum: boolean = true;

  public isInstanced: boolean = false;

  public instancedCount: number;

  indexBufferIndex: number = 0;

  updateVertex: boolean = false;
  updateIndex: boolean = false;

  private _vertexArrayBuffers = [];
  private _indexArrayBuffers = [];

  get vertexArrayBuffers() {
    if (this.updateVertex) {
      this._vertexArrayBuffers = this._createArrayBuffers(this.vertexBuffers);
      this.updateVertex = false;
    }
    return this._vertexArrayBuffers;
  }

  get indexArrayBuffers() {
    if (this.updateIndex) {
      this._indexArrayBuffers = this._createArrayBuffers(this.indexBuffers);
      this.updateIndex = false;
    }
    return this._indexArrayBuffers;
  }

  get attributes() {
    return this.vertexAttributes;
  }

  /**
   * @constructor
   */
  constructor(name?: string) {
    super(name !== undefined ? name : "DEFAULT_PRIMITIVENAME_" + primitiveID);
    this.id = primitiveID++;
  }

  /**
   * 添加一个顶点属性
   * @param {string} semantic
   * @param {number} size
   * @param {DataType} type
   * @param {boolean} normalized
   * @param {number} stride
   * @param {number} offset
   * @param {number} vertexBufferIndex
   */
  addAttribute(attribute: BufferAttribute) {
    const { semantic, instanced } = attribute;
    this.vertexAttributes[semantic] = attribute;
    if (instanced) {
      this.isInstanced = true;
    }
  }

  updateWeightsIndices(indices: number[]) {
    if (this.targets.length !== indices.length || indices.length === 0) {
      return;
    }
    for (let i = 0; i < indices.length; i++) {
      const currentIndex = indices[i];
      Object.keys(this.targets[i]).forEach((key: string) => {
        const semantic = this.targets[i][key].name;
        const index = this.targets[currentIndex][key].vertexBufferIndex;
        this.updateAttribBufferIndex(semantic, index);
      });
    }
  }

  updateAttribBufferIndex(semantic: string, index: number) {
    this.vertexAttributes[semantic].vertexBufferIndex = index;
  }

  /**
   * 通过 primitive 计算本地/世界坐标系的 min/max
   * @param {Matrix4} modelMatrix - Local to World矩阵,如果传此值，则计算min/max时将考虑RTS变换，如果不传，则计算local min/max
   * @param {boolean} littleEndian - 是否以小端字节序读取，默认true
   * */
  getMinMax(modelMatrix?: Matrix4, littleEndian = true) {
    let {
      vertexCount,
      vertexBuffers,
      vertexAttributes: {
        POSITION: { size, offset, stride, vertexBufferIndex }
      }
    } = this;
    let arrayBuffer = vertexBuffers[vertexBufferIndex];
    if (!(arrayBuffer instanceof ArrayBuffer)) {
      arrayBuffer = arrayBuffer.buffer;
    }
    if (stride === 0) {
      stride = size * 4;
    }
    const dataView = new DataView(arrayBuffer, offset);

    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < vertexCount; i++) {
      const base = offset + stride * i;
      const position = [
        dataView.getFloat32(base, littleEndian),
        dataView.getFloat32(base + 4, littleEndian),
        dataView.getFloat32(base + 8, littleEndian)
      ];
      modelMatrix && vec3.transformMat4(position, position, modelMatrix);
      vec3.min(min, min, position);
      vec3.max(max, max, position);
    }

    return {
      min,
      max
    };
  }

  private _createArrayBuffers(buffers) {
    let bufferArray = [];
    for (let i = 0; i < buffers.length; i += 1) {
      const arrayBuffers = buffers[i].buffers;
      bufferArray = bufferArray.concat(arrayBuffers);
    }
    return bufferArray;
  }

  finalize() {}
}
