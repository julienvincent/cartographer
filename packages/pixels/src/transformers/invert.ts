import * as defs from '../definitions';

export const invert = (pixel_grid: defs.PixelGrid) => {
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const { r, g, b } = pixel;
      return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b
      };
    });
  });
};
