import Polygon from '@/core/Entities/Polygon';
import Vector from '@/core/Primitives/Vector';
import PhysicsEntityAbstract from '@/core/Entities/PhysicsEntity.abstract';
import * as triangleHelper from '@/core/helpers/triangle';

type TriangleInput = {
  center: Vector;
  mass: number;
  height?: number;
};

export default class Triangle extends Polygon {
  constructor(options: TriangleInput) {
    const { center, mass } = options;

    const area = PhysicsEntityAbstract.massToArea(options.mass);
    const width = triangleHelper.widthFromArea(area);
    const height =
      options.height || triangleHelper.heightFromArea(area);

    const verticesMatrix = triangleHelper.verticesCalcMatrix(
      height,
      width
    );
    const vertices = verticesMatrix.map(
      ([x, y]) => new Vector(center.x + x, center.y + y)
    );

    super(center, mass, vertices);
  }

  get edgesNormals(): [Vector, Vector, Vector] {
    const [v1, v2, v3] = this.vertices;

    return [
      v2.subtract(v1).normal.normalized,
      v3.subtract(v2).normal.normalized,
      v1.subtract(v3).normal.normalized,
    ];
  }
}
