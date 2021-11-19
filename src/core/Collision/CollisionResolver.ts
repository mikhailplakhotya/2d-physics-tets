import { PhysicsEntity } from '@/core/helpers/types';
import Polygon from '@/core/Entities/Polygon';

export default class CollisionResolver {
  constructor(private entities: PhysicsEntity[]) {}

  resolveCollisions(
    collidingMap: Map<PhysicsEntity, PhysicsEntity[]>
  ): CollisionResolver {
    for (const [entityFrom, entitiesTo] of collidingMap) {
      entitiesTo.forEach(entityTo =>
        CollisionResolver.resolveCollision(entityFrom, entityTo)
      );
    }

    return this;
  }

  private static resolveCollision(
    entityFrom: PhysicsEntity,
    entityTo: PhysicsEntity
  ): void {
    if (
      entityFrom instanceof Polygon &&
      entityTo instanceof Polygon
    ) {
      CollisionResolver.polygonsResolve(entityFrom, entityTo);
    }
  }

  private static polygonsResolve(
    polygonFrom: Polygon,
    polygonTo: Polygon
  ): void {
    const projectionNormals = [
      ...polygonFrom.edgesNormals,
      ...polygonTo.edgesNormals.filter(
        edgeTo =>
          !polygonFrom.edgesNormals.some(edgeFrom =>
            edgeFrom.collinearTo(edgeTo)
          )
      ),
    ];

    /**
     * TODO: find an algorithm for both dynamic
     *  consider one entity to be static for simplicity
     */
    const [shiftingPoly, staticPoly] = [
      polygonFrom,
      polygonTo,
    ].sort((a, b) => b.shift.abs - a.shift.abs);

    const shift = shiftingPoly.shift;

    if (shift.abs === 0) return;

    const deltas = projectionNormals.map(normal => {
      const shiftingProjections =
        shiftingPoly.verticesProjectionTo(normal);
      const staticProjections =
        staticPoly.verticesProjectionTo(normal);
      const [shiftingMin, shiftingMax] = [
        Math.min(...shiftingProjections),
        Math.max(...shiftingProjections),
      ];
      const [staticMin, staticMax] = [
        Math.min(...staticProjections),
        Math.max(...staticProjections),
      ];
      const shadowAbs = Math.min(
        Math.abs(staticMax - shiftingMin),
        Math.abs(shiftingMax - staticMin)
      );
      return Math.abs(
        normal.productScalar(shadowAbs).projectionTo(shift)
      );
    });

    const delta = Math.min(...deltas);
    const resolver =
      shift.normalized.reversed.productScalar(delta);
    shiftingPoly.update({ resolver });
  }
}
