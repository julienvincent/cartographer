import { MC_BLOCK_COLORS } from '../data';
import * as defs from '../defs';

const findColorIndex = (colors: defs.RGBColor[], pixel: defs.Pixel) => {
  return colors.findIndex((color) => {
    const [r, g, b] = color;
    return r === pixel.r && g === pixel.g && b === pixel.b;
  });
};

export const convertPixelGridToMCBlocks = (pixel_grid: defs.PixelGrid): defs.MCBlockGrid => {
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const matching = MC_BLOCK_COLORS.find((mapping) => {
        return findColorIndex(mapping.colors, pixel) !== -1;
      });

      const [block_id] = matching!.block_ids;

      return {
        block_id: block_id,
        height_variant: findColorIndex(matching!.colors, pixel)
      };
    });
  });
};
