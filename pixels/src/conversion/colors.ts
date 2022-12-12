import * as nearest from 'nearest-color';
import * as defs from '../defs';

export const flattenColors = (palette: defs.BlockPalette) => {
  return palette
    .map((block) => {
      return block.colors;
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
};

export const convertPixelGridColorsForMC = (pixel_grid: defs.PixelGrid, palette: defs.BlockPalette) => {
  const findClosestMatchingColor = nearest.from(flattenColors(palette));
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const { rgb } = findClosestMatchingColor(pixel);
      return rgb;
    });
  });
};
