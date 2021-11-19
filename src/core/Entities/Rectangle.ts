import Polygon from '@/core/Entities/Polygon';
import Vector from '@/core/Primitives/Vector';
import PhysicsEntityAbstract from '@/core/Entities/PhysicsEntity.abstract';

const verticesCalcMatrix = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

type RectangleInput = {
  center: Vector;
  mass: number;
  width?: number;
};

export default class Rectangle extends Polygon {
  constructor(options: RectangleInput) {
    const { center, mass } = options;

    const area = PhysicsEntityAbstract.massToArea(options.mass);
    const width = options.width || Math.sqrt(area);
    const height = options.width
      ? area / options.width
      : Math.sqrt(area);

    const vertices = verticesCalcMatrix.map(
      ([signW, signH]) =>
        new Vector(
          center.x + (signW * width) / 2,
          center.y + (signH * height) / 2
        )
    );

    super(center, mass, vertices);
  }

  get edgesNormals(): Vector[] {
    const [v1, v2, v3] = this.vertices;
    return [
      v2.subtract(v1).normal.normalized,
      v3.subtract(v2).normal.normalized,
    ];
  }
}
