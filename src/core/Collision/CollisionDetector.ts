import Circle from '@/core/Entities/Circle';
import Polygon from '@/core/Entities/Polygon';
import { PhysicsEntity } from '@/core/helpers/types';

export default class CollisionDetector {
  private collisionBroadMap = new Map<
    PhysicsEntity,
    PhysicsEntity[]
  >();
  private collisionNarrowMap = new Map<
    PhysicsEntity,
    PhysicsEntity[]
  >();

  constructor(
    private entities: PhysicsEntity[],
    private ctx: CanvasRenderingContext2D
  ) {
    this.entities = entities;
  }

  get collidingMap(): Map<PhysicsEntity, PhysicsEntity[]> {
    return this.collisionNarrowMap;
  }

  detectCollisions(): CollisionDetector {
    this.resetCollisions();
    this.runBroadPhase();
    return this.runNarrowPhase();
  }

  private resetCollisions(): void {
    this.collisionBroadMap = new Map();
    this.collisionNarrowMap = new Map();
  }

  private runBroadPhase(): CollisionDetector {
    this.entities.forEach(entity => {
      this.entities.forEach(subEntity => {
        if (entity === subEntity) return;
        if (
          this.collisionBroadMap.get(entity)?.includes(subEntity)
        ) {
          return;
        }
        if (
          CollisionDetector.isBroadColliding(entity, subEntity)
        ) {
          this.collisionBroadMap.get(entity)?.push(subEntity) ||
            this.collisionBroadMap.set(entity, [subEntity]);
          this.collisionBroadMap.get(subEntity)?.push(entity) ||
            this.collisionBroadMap.set(subEntity, [entity]);
        }
      });
    });
    return this;
  }

  private runNarrowPhase(): CollisionDetector {
    for (const [entityFrom, entitiesTo] of this
      .collisionBroadMap) {
      entitiesTo.forEach(entityTo => {
        if (
          this.collisionNarrowMap
            .get(entityFrom)
            ?.includes(entityTo)
        ) {
          return;
        }
        if (this.isNarrowColliding(entityFrom, entityTo)) {
          this.collisionNarrowMap
            .get(entityFrom)
            ?.push(entityTo) ||
            this.collisionNarrowMap.set(entityFrom, [entityTo]);
          this.collisionNarrowMap
            .get(entityTo)
            ?.push(entityFrom) ||
            this.collisionNarrowMap.set(entityTo, [entityFrom]);
        }
      });
    }
    return this;
  }

  private isNarrowColliding(
    entityFrom: PhysicsEntity,
    entityTo: PhysicsEntity
  ): boolean {
    if (
      entityFrom instanceof Circle &&
      entityTo instanceof Circle
    ) {
      return (
        entityFrom.center.distance(entityTo.center) <=
        entityFrom.radius + entityTo.radius
      );
    }

    if (
      entityFrom instanceof Circle ||
      entityTo instanceof Circle
    ) {
      const circle =
        entityFrom instanceof Circle
          ? (entityFrom as Circle)
          : (entityTo as Circle);
      const polygon =
        entityFrom instanceof Polygon
          ? (entityFrom as Polygon)
          : (entityTo as Polygon);

      if (
        this.ctx.isPointInPath(
          polygon.path,
          circle.center.x,
          circle.center.y
        )
      ) {
        return true;
      }

      for (const edge of polygon.edges) {
        const distance = edge.distanceToPoint(circle.center);
        if (distance <= circle.radius) return true;
      }

      return false;
    }

    const projectionAxes = [
      ...entityFrom.edgesNormals,
      ...entityTo.edgesNormals.filter(
        edgeTo =>
          !entityFrom.edgesNormals.some(edgeFrom =>
            edgeFrom.collinearTo(edgeTo)
          )
      ),
    ];

    for (const axis of projectionAxes) {
      const fromProjections =
        entityFrom.verticesProjectionTo(axis);
      const toProjections = entityTo.verticesProjectionTo(axis);
      const [fromMin, fromMax] = [
        Math.min(...fromProjections),
        Math.max(...fromProjections),
      ];
      const [toMin, toMax] = [
        Math.min(...toProjections),
        Math.max(...toProjections),
      ];
      if (toMin >= fromMax || toMax <= fromMin) {
        return false;
      }
    }

    return true;
  }

  private static isBroadColliding(
    entityFrom: PhysicsEntity,
    entityTo: PhysicsEntity
  ): boolean {
    const [min1, max1] = entityFrom.boundingBox;
    const [min2, max2] = entityTo.boundingBox;

    return (
      min1.x <= max2.x &&
      max1.x >= min2.x &&
      min1.y <= max2.y &&
      max1.y >= min2.y
    );
  }
}
