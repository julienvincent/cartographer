import { MC_BLOCK_COLORS } from '../data';
import * as nearest from 'nearest-color';
import * as defs from '../defs';

const flattened_colors = MC_BLOCK_COLORS.map((mapping) => {
  return mapping.colors.slice(0, 3);
})
  .flat()
  .reduce((acc: Record<string, defs.Pixel>, colors, i) => {
    const [r, g, b] = colors;
    acc[i] = {
      r,
      g,
      b
    };

    return acc;
  }, {});

const findClosestMatchingColor = nearest.from(flattened_colors);

export const convertPixelGridColorsForMC = (pixel_grid: defs.PixelGrid) => {
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const { rgb } = findClosestMatchingColor(pixel);
      return rgb;
    });
  });
};

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
