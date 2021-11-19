import Vector from '@/core/Primitives/Vector';
import Renderer from '@/core/Renderer';
import Physics from '@/core/Physics';
import Rectangle from '@/core/Entities/Rectangle';
import { PhysicsEntity } from '@/core/helpers/types';
import Triangle from '@/core/Entities/Triangle';

export default class TheGame {
  private renderer: Renderer;
  private physics: Physics;

  readonly ctx: CanvasRenderingContext2D;
  readonly mousePosition: Vector = new Vector();
  private entities: PhysicsEntity[] = [];

  constructor(readonly canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      throw new Error(
        "contextType doesn't match a possible drawing context, or differs from the first contextType requested"
      );
    }
    this.ctx = ctx;

    this.physics = new Physics(this.entities, this.ctx);
    this.renderer = new Renderer(this.ctx, this.entities);
  }

  start(): void {
    this.watchMousePosition();

    this.addEntity(
      new Triangle({
        center: new Vector(450, 150),
        mass: 10,
      })
    );

    this.addEntity(
      new Rectangle({
        center: new Vector(
          this.canvas.width / 2,
          this.canvas.height * 0.85
        ),
        mass: 60,
        width: (this.canvas.width / 15) * 10,
      })
    );

    // addedEntity.rotate(Math.PI / 10);

    this.engineLoop();
  }

  engineLoop(): void {
    requestAnimationFrame(() => {
      this.physics.runFrameLogic();
      this.renderer.render();
      this.engineLoop();
    });
  }

  watchMousePosition(): void {
    this.canvas.addEventListener('mousemove', e => {
      this.mousePosition.set(e.offsetX, e.offsetY);
      // this.player.update({
      //   center: this.mousePosition,
      // });
    });
  }

  addEntity(entity: PhysicsEntity): PhysicsEntity {
    this.entities.push(entity);
    return entity;
  }
}
