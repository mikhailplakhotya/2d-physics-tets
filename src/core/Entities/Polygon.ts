import PhysicsEntityAbstract from '@/core/Entities/PhysicsEntity.abstract';
import Vector from '@/core/Primitives/Vector';
import LineSegment from '@/core/Primitives/LineSegment';

export default class Polygon extends PhysicsEntityAbstract {
  path: Path2D = new Path2D();

  protected constructor(
    center: Vector,
    mass: number,
    protected vertices: Vector[]
  ) {
    super(center, mass, vertices);
  }

  get boundingBox(): [Vector, Vector] {
    const xArray = this.vertices.map(vertex => vertex.x);
    const yArray = this.vertices.map(vertex => vertex.y);
    const xMin = Math.min(...xArray);
    const xMax = Math.max(...xArray);
    const yMin = Math.min(...yArray);
    const yMax = Math.max(...yArray);
    return [new Vector(xMin, yMin), new Vector(xMax, yMax)];
  }

  get edges(): LineSegment[] {
    return this.vertices.reduce(
      (res, vertex, index) => [
        ...res,
        new LineSegment(
          this.vertices.at(index - 1) as Vector,
          vertex
        ),
      ],
      [] as LineSegment[]
    );
  }

  get edgesNormals(): Vector[] {
    const normals: Vector[] = [];

    for (let i = -1; i < this.vertices.length; i++) {
      const [from, to] = [
        this.vertices.at(i + 1),
        this.vertices.at(i),
      ];
      if (!from || !to) return normals;

      normals.push(to.subtract(from).normal.normalized);
    }

    return normals.reduce(
      (res, vector) => {
        if (res.some(resV => resV.collinearTo(vector))) {
          return res;
        }
        return [...res, vector];
      },
      [normals[0]]
    );
  }

  getNearestVertexTo(point: Vector): Vector {
    return this.vertices
      .map(vertex => vertex.subtract(point))
      .reduce((res, vertex) =>
        vertex.abs < res.abs ? vertex : res
      );
  }

  rotate(rad: number, point?: Vector): void {
    const rotationPoint = point || this.center;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const [axisX, axisY] = Vector.basisAxes.map(
      axis =>
        new Vector(
          cos * axis.x - sin * axis.y,
          sin * axis.x + cos * axis.y
        )
    );

    this.vertices = this.vertices.map(vertex => {
      const shifted = vertex.subtract(rotationPoint);
      const rotated = axisX
        .productScalar(shifted.x)
        .add(axisY.productScalar(shifted.y));
      return rotated.add(rotationPoint);
    });
  }

  verticesProjectionTo(vector: Vector): number[] {
    return this.vertices.map(vertex =>
      vertex.projectionTo(vector)
    );
  }

  draw(ctx: CanvasRenderingContext2D): PhysicsEntityAbstract {
    const [start] = this.vertices;
    const path = (this.path = new Path2D());
    path.moveTo(...start.tuple);
    for (const vertex of this.vertices.slice(1)) {
      path.lineTo(...vertex.tuple);
    }
    path.closePath();
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.stroke(path);
    ctx.restore();
    return this;
  }
}
