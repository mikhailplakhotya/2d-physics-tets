import Vector from '@/core/Primitives/Vector';

export default class LineSegment {
  constructor(
    readonly pointA: Vector,
    readonly pointB: Vector
  ) {}

  get vectorAB(): Vector {
    return this.pointB.subtract(this.pointA);
  }

  distanceToPoint(pointC: Vector): number {
    const AC = pointC.subtract(this.pointA);
    const ACProjection = AC.projectionTo(this.vectorAB);
    if (ACProjection <= 0) {
      return AC.abs;
    } else if (ACProjection >= this.vectorAB.abs) {
      return pointC.distance(this.pointB);
    } else {
      return Math.sqrt(AC.abs ** 2 - ACProjection ** 2);
    }
  }
}
