export const areaFromWidthAndHeight = (
  width?: number,
  height?: number
): number => {
  if (!width || !height) return 0;
  return (width * height) / 2;
};

export const areaFromWidth = (width?: number): number => {
  if (!width) return 0;
  return (width ** 2 * Math.sqrt(3)) / 4;
};

export const areaFromHeight = (height?: number): number => {
  if (!height) return 0;
  return height ** 2 / Math.sqrt(3);
};

export const widthFromArea = (area: number): number => {
  return 2 * Math.sqrt(area / Math.sqrt(3));
};

export const heightFromArea = (area: number): number => {
  return Math.sqrt(area * Math.sqrt(3));
};

export const verticesCalcMatrix = (
  height: number,
  width: number
): number[][] => [
  [0, (-height * 2) / 3],
  [width / 2, height / 3],
  [-width / 2, height / 3],
];
