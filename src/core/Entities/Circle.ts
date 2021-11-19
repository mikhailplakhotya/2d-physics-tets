import PhysicsEntityAbstract from '@/core/Entities/PhysicsEntity.abstract';
import Vector from '@/core/Primitives/Vector';

type CircleInput = {
  center: Vector;
  mass: number;
};

export default class Circle extends PhysicsEntityAbstract {
  readonly radius: number;

  constructor(options: CircleInput) {
    const { center } = options;

    const area = PhysicsEntityAbstract.massToArea(options.mass);
    const mass = options.mass;

    super(center, mass, []);

    this.radius = Math.sqrt(area / Math.PI);
  }

  get boundingBox(): [Vector, Vector] {
    const xMin = this.center.x - this.radius;
    const xMax = this.center.x + this.radius;
    const yMin = this.center.y - this.radius;
    const yMax = this.center.y + this.radius;
    return [new Vector(xMin, yMin), new Vector(xMax, yMax)];
  }

  rotate(rad: number, point?: Vector): void {
    const rotationPoint = point || this.center;
    console.log(rotationPoint);
  }

  projectionTo(vector: Vector): number[] {
    const projection = this.center.projectionTo(vector);
    return [projection - this.radius, projection + this.radius];
  }

  draw(ctx: CanvasRenderingContext2D): PhysicsEntityAbstract {
    const region = new Path2D();
    region.arc(
      this.center.x,
      this.center.y,
      this.radius,
      0,
      2 * Math.PI
    );
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.stroke(region);
    ctx.restore();
    return this;
  }
}
