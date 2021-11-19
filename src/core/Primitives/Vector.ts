export default class Vector implements Iterable<number> {
  static readonly basisAxes: [Vector, Vector] = [
    new Vector(1, 0),
    new Vector(0, 1),
  ];

  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get abs(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get normal(): Vector {
    return new Vector(-this.y, this.x);
  }

  get normalized(): Vector {
    return new Vector(
      this.x / this.abs || 0,
      this.y / this.abs || 0
    );
  }

  get tuple(): [number, number] {
    return [this.x, this.y];
  }

  get reversed(): Vector {
    return new Vector(-this.x, -this.y);
  }

  set(x: number, y: number): Vector {
    this.x = x;
    this.y = y;
    return this;
  }

  add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  distance(vector: Vector): number {
    return this.subtract(vector).abs;
  }

  collinearTo(vector: Vector): boolean {
    const k = this.x / vector.x;
    return this.y === k * vector.y;
  }

  projectionTo(vector: Vector): number {
    return this.dot(vector) / vector.abs;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  productScalar(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  angleRad(vector: Vector): number {
    return Math.acos(this.dot(vector) / (this.abs * vector.abs));
  }

  *[Symbol.iterator](): Generator<number> {
    yield this.x;
    yield this.y;
  }

  static sum(...vectors: Vector[]): Vector {
    return vectors.reduce(
      (res, vector) => res.add(vector),
      new Vector(0, 0)
    );
  }
}
