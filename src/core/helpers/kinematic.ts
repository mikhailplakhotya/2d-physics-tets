import Vector from '@/core/Primitives/Vector';

export const velocityFn = (
  velocityStart: Vector,
  acceleration: Vector,
  deltaTime: number
): Vector => {
  return new Vector(
    velocityStart.x + acceleration.x * deltaTime,
    velocityStart.y + acceleration.y * deltaTime
  );
};

export const positionFn = (
  positionStart: Vector,
  velocityStart: Vector,
  acceleration: Vector,
  deltaTime: number
): Vector => {
  return new Vector(
    positionStart.x +
      velocityStart.x * deltaTime +
      (acceleration.x * deltaTime ** 2) / 2,
    positionStart.y +
      velocityStart.y * deltaTime +
      (acceleration.y * deltaTime ** 2) / 2
  );
};
