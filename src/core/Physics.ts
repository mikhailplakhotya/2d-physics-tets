import CollisionDetector from '@/core/Collision/CollisionDetector';
import CollisionResolver from '@/core/Collision/CollisionResolver';
import { PhysicsEntity } from '@/core/helpers/types';
import Vector from '@/core/Primitives/Vector';
import { PHYSICS_G, SCENE_WIDTH } from '@/config/constants';
import {
  positionFn,
  velocityFn,
} from '@/core/helpers/kinematic';

export default class Physics {
  private collisionDetector: CollisionDetector;
  private collisionResolver: CollisionResolver;
  private prevFrameTimestamp = 0;
  private frameSeconds = 0;
  private readonly pxInMeter: number;
  private readonly freeFallAcc: Vector;

  constructor(
    private entities: PhysicsEntity[],
    private ctx: CanvasRenderingContext2D
  ) {
    this.collisionDetector = new CollisionDetector(
      entities,
      ctx
    );
    this.collisionResolver = new CollisionResolver(entities);
    this.pxInMeter = ctx.canvas.width / SCENE_WIDTH;
    this.freeFallAcc = new Vector(0, PHYSICS_G * this.pxInMeter);
    this.initKinematic();
    this.runFrameLogic();
  }

  initKinematic(): void {
    this.entities.forEach(entity => {
      entity.addForce(
        this.freeFallAcc.productScalar(entity.mass)
      );
    });
  }

  runFrameLogic(): void {
    if (!this.prevFrameTimestamp) {
      this.prevFrameTimestamp = performance.now();
      return;
    }
    this.frameSeconds =
      (performance.now() - this.prevFrameTimestamp) / 1000;

    this.runKinematic();

    const collidingMap =
      this.collisionDetector.detectCollisions().collidingMap;

    this.entities.forEach(entity =>
      collidingMap.has(entity)
        ? entity.setColor('red')
        : entity.setColor('blue')
    );

    this.collisionResolver.resolveCollisions(collidingMap);

    this.prevFrameTimestamp = performance.now();
  }

  onEntityAdded(): void {
    this.initKinematic();
  }

  private runKinematic(): void {
    for (const entity of this.entities) {
      const velocityUpd = velocityFn(
        entity.velocity,
        entity.acceleration,
        this.frameSeconds
      );
      const positionUpd = positionFn(
        entity.center,
        entity.velocity,
        entity.acceleration,
        this.frameSeconds
      );
      console.log(entity.acceleration);
      entity.update({
        center: positionUpd,
        velocity: velocityUpd,
      });
    }
  }

  private pxToMeter(px: number): number {
    return px / this.pxInMeter;
  }

  private meterToPx(meter: number): number {
    return meter * this.pxInMeter;
  }
}
