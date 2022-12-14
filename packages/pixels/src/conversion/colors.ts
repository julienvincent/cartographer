import * as nearest from 'nearest-color';
import * as defs from '../definitions';

export const flattenColors = (palette: defs.BlockPalette, spectrum: defs.BlockColorSpectrum) => {
  return palette
    .map((block) => {
      switch (spectrum) {
        case defs.BlockColorSpectrum.Full: {
          return block.colors;
        }
        case defs.BlockColorSpectrum.Flat: {
          return [block.colors[0]];
        }
      }
    })
    .flat()
    .reduce((acc: Record<string, defs.Pixel>, pixel, i) => {
      acc[i] = pixel;
      return acc;
    }, {});
};

export type PixelsToMcColorParams = {
  palette: defs.BlockPalette;

  /**
   * The MC block color spectrum to use when finding matching colors in the palette. This setting will impact how blocks
   * need to be placed in 3D space as the height of blocks relative to each other controls the shade of the color in a
   * MC map.
   *
   * - A value of 'full' will make use of all the colors in the palette resulting in variation in block placement height. This
   *   will result in 'staircasing' in the resulting generated block space - potentially making it harder to build.
   * - A value of 'flat' will use only the first color option in the palette resulting in a perfectly flat map. This will be an
   *   easier build but will have 3x less hue options in the resulting map-art.
   */
  color_spectrum: defs.BlockColorSpectrum;
};

export const convertPixelGridColorsForMC = (pixel_grid: defs.PixelGrid, params: PixelsToMcColorParams) => {
  const findClosestMatchingColor = nearest.from(flattenColors(params.palette, params.color_spectrum));
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const { rgb } = findClosestMatchingColor(pixel);
      return rgb;
    });
  });
};
