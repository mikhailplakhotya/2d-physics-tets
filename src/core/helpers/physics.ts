import Vector from '@/core/Primitives/Vector';
import { PHYSICS_G } from '@/config/constants';

export const weight = (mass: number): Vector =>
  new Vector(0, mass * PHYSICS_G);

export const orientationDefault = new Vector(0, 1);
