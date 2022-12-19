import * as nearest from 'nearest-color';
import * as defs from '../definitions';

const findColorIndex = (colors: defs.PaletteColorTuple, pixel: defs.Pixel) => {
  return colors.findIndex((color) => {
    const { r, g, b } = color;
    return r === pixel.r && g === pixel.g && b === pixel.b;
  });
};

/**
 * Map each pixel in a PixelGrid to it's associated Minecraft block id and variant.
 *
 * This function will balance selected blocks from the given BlockPalette such that all blocks associated to a given
 * color are used equally. This is done by keeping track of blocks that have been previously selected and picking the
 * block from the palette with the lowest usage count.
 */
export const convertPixelGridToMCBlocks = (pixel_grid: defs.PixelGrid, palette: defs.BlockPalette): defs.BlockGrid => {
  const block_counts = new Map<string, number>();

  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const palette_item = palette.find((block) => {
        return findColorIndex(block.colors, pixel) !== -1;
      });

      if (!palette_item) {
        throw new Error('Could not find matching block');
      }

      const block = palette_item.blocks.reduce((current, block) => {
        const count_left = block_counts.get(current.id) || 0;
        const count_right = block_counts.get(block.id) || 0;

        if (count_right < count_left) {
          return block;
        }
        return current;
      }, palette_item.blocks[0]);

      const count = block_counts.get(block.id) || 0;
      block_counts.set(block.id, count + 1);

      return {
        ...block,
        hue: findColorIndex(palette_item.colors, pixel) as defs.BlockHue
      };
    });
  });
};

const flattenColors = (palette: defs.BlockPalette, spectrum: defs.BlockColorSpectrum) => {
  return palette
    .map((block) => {
      switch (spectrum) {
        case defs.BlockColorSpectrum.Full: {
          return block.colors;
        }
        case defs.BlockColorSpectrum.Flat: {
          return [block.colors[1]];
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

export const createColorPaletteTransformer = (params: PixelsToMcColorParams): defs.PixelTransformer => {
  const findClosestMatchingColor = nearest.from(flattenColors(params.palette, params.color_spectrum));
  return (pixel) => {
    const { rgb } = findClosestMatchingColor(pixel);
    return rgb;
  };
};
