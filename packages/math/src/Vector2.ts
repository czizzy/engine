import { MathUtil } from "./MathUtil";
import { Matrix3x3 } from "./Matrix3x3";
import { Matrix4x4 } from "./Matrix4x4";

/**
 * 二维向量
 */
export class Vector2 {
  /** @internal 零向量，readonly */
  static readonly _Zero = new Vector2(0.0, 0.0);
  /** @internal 一向量，readonly */
  static readonly _One = new Vector2(1.0, 1.0);

  /**
   * 将两个向量相加，并输出结果out
   *
   * @param a - 向量
   * @param b - 向量
   * @param out - 向量相加结果
   */
  static add(a: Vector2, b: Vector2, out: Vector2): void {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
  }

  /**
   * 将两个向量相减 并输出结果out
   *
   * @param a - 左向量
   * @param b - 右向量
   * @param out - 两个二维向量的相减结果
   */
  static subtract(a: Vector2, b: Vector2, out: Vector2): void {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
  }

  /**
   * 将两个向量相乘 并输出结果out
   *
   * @param a - 左向量
   * @param b - 右向量
   * @param out - 两个二维向量的相乘结果
   */
  static multiply(a: Vector2, b: Vector2, out: Vector2): void {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
  }

  /**
   * 将两个二维向量相除 并输出结果out
   *
   * @param a - 左向量
   * @param b - 右向量
   * @param out - 两个二维向量的相除结果
   */
  static divide(a: Vector2, b: Vector2, out: Vector2): void {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
  }

  /**
   * 计算两个二维向量的点积
   *
   * @param a - 左向量
   * @param b - 右向量
   */
  static dot(a: Vector2, b: Vector2): number {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * 计算两个二维向量的距离
   *
   * @param a - 向量
   * @param b - 向量
   */
  static distance(a: Vector2, b: Vector2): number {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * 计算两个二维向量的距离的平方
   *
   * @param a - 向量
   * @param b - 向量
   */
  static distanceSquared(a: Vector2, b: Vector2): number {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return x * x + y * y;
  }

  /**
   * 判断两个二维向量的值是否相等
   *
   * @param a - 向量
   * @param b - 向量
   */
  static equals(a: Vector2, b: Vector2): boolean {
    return MathUtil.equals(a.x, b.x) && MathUtil.equals(a.y, b.y);
  }

  /**
   * 插值二维向量
   *
   * @param a - 左向量
   * @param b - 右向量
   * @param t - 插值比例
   * @param out - 插值结果
   */
  static lerp(a: Vector2, b: Vector2, t: number, out: Vector2): void {
    const { x, y } = a;
    out.x = x + (b.x - x) * t;
    out.y = y + (b.y - y) * t;
  }

  /**
   * 分别取两个二维向量x、y的最大值计算新的二维向量
   *
   * @param a - 向量
   * @param b - 向量
   * @param out - 结果向量
   */
  static max(a: Vector2, b: Vector2, out: Vector2): void {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
  }

  /**
   * 分别取两个二维向量x、y的最小值计算新的二维向量
   *
   * @param a - 向量
   * @param b - 向量
   * @param out - 结果向量
   */
  static min(a: Vector2, b: Vector2, out: Vector2): void {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
  }

  /**
   * 将向量a取反，并将结果输出到out
   *
   * @param a - 向量
   * @param out - 向量取反的结果
   */
  static negate(a: Vector2, out: Vector2): void {
    out.x = -a.x;
    out.y = -a.y;
  }

  /**
   * 将向量a归一化，并将结果输出到out
   *
   * @param a - 向量
   * @param out - 向量归一化的结果
   */
  static normalize(a: Vector2, out: Vector2): void {
    const { x, y } = a;
    let len: number = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = x * len;
      out.y = y * len;
    }
  }

  /**
   * 将向量a缩放，并将结果输出到out
   *
   * @param a - 向量
   * @param scale - 缩放因子
   * @param out - 向量缩放的结果
   */
  static scale(a: Vector2, s: number, out: Vector2): void {
    out.x = a.x * s;
    out.y = a.y * s;
  }

  /**
   * 通过3x3矩阵将一个二维向量转换到另一个二维向量
   *
   * @param a - 向量
   * @param m - 转换矩阵
   * @param out - 通过矩阵转换后的向量
   */
  static transformMat3x3(a: Vector2, m: Matrix3x3, out: Vector2): void {
    const { x, y } = a;
    const e = m.elements;
    out.x = x * e[0] + y * e[3] + e[6];
    out.y = x * e[1] + y * e[4] + e[7];
  }

  /**
   * 通过4x4矩阵将一个二维向量转换到另一个二维向量
   *
   * @param a - 向量
   * @param m - 转换矩阵
   * @param out - 通过矩阵转换后的向量
   */
  static transformMat4x4(a: Vector2, m: Matrix4x4, out: Vector2): void {
    const { x, y } = a;
    const e = m.elements;
    out.x = x * e[0] + y * e[4] + e[12];
    out.y = x * e[1] + y * e[5] + e[13];
  }

  /** X轴坐标。 */
  x: number;
  /** Y轴坐标 */
  y: number;

  /**
   * 创建一个Vector2实例
   *
   * @param x - X轴坐标，默认值0
   * @param y - Y轴坐标，默认值0
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * 设置x, y的值，并返回当前向量
   *
   * @param x - X轴坐标
   * @param y - Y轴坐标
   */
  setValue(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * 创建一个新的二维向量，并用当前向量值初始化
   */
  clone(): Vector2 {
    let ret = new Vector2(this.x, this.y);
    return ret;
  }

  /**
   * 将当前向量值拷贝给out向量 rename~copy
   *
   * @param out - 目标向量
   */
  cloneTo(out: Vector2): void {
    out.x = this.x;
    out.y = this.y;
  }

  /**
   * 将当前向量加上给定的向量a，并返回当前向量
   *
   * @param a - 给定的向量
   */
  add(a: Vector2): Vector2 {
    this.x += a.x;
    this.y += a.y;
    return this;
  }

  /**
   * 将当前向量减去给定的向量a，并返回当前向量
   *
   * @param a - 给定的向量
   */
  subtract(a: Vector2): Vector2 {
    this.x -= a.x;
    this.y -= a.y;
    return this;
  }

  /**
   * 将当前向量乘以给定的向量a，并返回当前向量
   *
   * @param a - 给定的向量
   */
  multiply(a: Vector2): Vector2 {
    this.x *= a.x;
    this.y *= a.y;
    return this;
  }

  /**
   * 将当前向量除以给定的向量a，并返回当前向量
   *
   * @param a - 给定的向量
   */
  divide(a: Vector2): Vector2 {
    this.x /= a.x;
    this.y /= a.y;
    return this;
  }

  /**
   * 计算一个二维向量的标量长度 merge～len
   *
   */
  length(): number {
    const { x, y } = this;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * 计算一个二维向量的标量长度的平方 merge~sqrLen rename~squaredLength
   */
  lengthSquared(): number {
    const { x, y } = this;
    return x * x + y * y;
  }

  /**
   * 当前向量取反，并返回
   */
  negate(): Vector2 {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  /**
   * 当前向量归一化，并返回
   */
  normalize(): Vector2 {
    const { x, y } = this;
    let len: number = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this.x = x * len;
      this.y = y * len;
    }
    return this;
  }

  /**
   * 当前向量缩放，并返回
   *
   * @param s - 缩放因子
   */
  scale(s: number): Vector2 {
    this.x *= s;
    this.y *= s;
    return this;
  }
}
