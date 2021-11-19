import { PhysicsEntity } from '@/core/helpers/types';

export default class Renderer {
  constructor(
    private ctx: CanvasRenderingContext2D,
    private entities: PhysicsEntity[]
  ) {
    return this;
  }

  render(): void {
    this.clear();
    this.entities.forEach(entity => entity.draw(this.ctx));
  }

  clear(): void {
    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }
}
