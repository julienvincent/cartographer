import * as defs from '../definitions';

export const applyGrayScale = (pixel_grid: defs.PixelGrid) => {
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const { r, g, b } = pixel;
      const average = (r + g + b) / 3;
      return {
        r: average,
        g: average,
        b: average
      };
    });
  });
};
