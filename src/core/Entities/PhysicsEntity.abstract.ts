import Vector from '@/core/Primitives/Vector';
import {
  orientationDefault,
  weight,
} from '@/core/helpers/physics';

export default abstract class PhysicsEntityAbstract {
  readonly forces: Vector[] = [];
  orientation = orientationDefault;
  velocity = new Vector();
  color = 'blue';
  prevCenter: Vector;

  isStatic = false;

  protected constructor(
    readonly center: Vector,
    readonly mass: number,
    protected vertices: Vector[]
  ) {
    this.prevCenter = center.clone();
  }

  get force(): Vector {
    return Vector.sum(...this.forces);
  }

  get acceleration(): Vector {
    return this.force.normalized.productScalar(
      this.force.abs / this.mass
    );
  }

  get shift(): Vector {
    return this.center.subtract(this.prevCenter);
  }

  static massToArea(mass: number): number {
    return mass * 1000;
  }

  addForce(force: Vector): void {
    this.forces.push(force);
  }

  setColor(color: string): void {
    this.color = color;
  }

  update({
    center,
    velocity,
    resolver,
  }: {
    center?: Vector;
    velocity?: Vector;
    resolver?: Vector;
  }): void {
    if (center) {
      this.prevCenter = this.center.clone();
      const deltaVector = center.subtract(this.center);

      this.vertices = this.vertices.map(vertex =>
        vertex.add(deltaVector)
      );
      this.center.set(...center.tuple);
    }
    if (velocity) {
      this.velocity.set(...velocity.tuple);
    }
    if (resolver) {
      this.vertices = this.vertices.map(vertex =>
        vertex.add(resolver)
      );
      const newCenter = this.center.add(resolver);
      this.center.set(...newCenter.tuple);
    }
  }

  abstract rotate(rad: number, point?: Vector): void;
  abstract get boundingBox(): [Vector, Vector];
  abstract draw(
    ctx: CanvasRenderingContext2D
  ): PhysicsEntityAbstract;
}
