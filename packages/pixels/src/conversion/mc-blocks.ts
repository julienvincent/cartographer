import * as defs from '../defs';

const findColorIndex = (colors: defs.RGBColor[], pixel: defs.Pixel) => {
  return colors.findIndex((color) => {
    const [r, g, b] = color;
    return r === pixel.r && g === pixel.g && b === pixel.b;
  });
};

/**
 * Map each pixel in a PixelGrid to it's associated minecraft block id and variant.
 */
export const convertPixelGridToMCBlocks = (
  pixel_grid: defs.PixelGrid,
  palette: defs.BlockPalette
): defs.MCBlockGrid => {
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const block = palette.find((block) => {
        return findColorIndex(block.colors, pixel) !== -1;
      });

      if (!block) {
        throw new Error('could not find matching block');
      }

      return {
        ...block,
        y_offset: findColorIndex(block.colors, pixel)
      };
    });
  });
};
