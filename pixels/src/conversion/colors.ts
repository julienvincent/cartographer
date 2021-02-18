import { MC_COLOR_MAP } from '../data/mc-color-mapping';
import * as nearest from 'nearest-color';
import * as defs from '../defs';

const findClosestMatchingColor = nearest.from(
  MC_COLOR_MAP.reduce((acc: Record<string, defs.Pixel>, { colors }, i) => {
    const [[r, g, b]] = colors;
    acc[i] = {
      r,
      g,
      b
    };

    return acc;
  }, {})
);

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
