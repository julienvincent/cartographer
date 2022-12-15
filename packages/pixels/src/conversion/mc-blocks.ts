import * as defs from '../definitions';

const findColorIndex = (colors: defs.PaletteColorTuple, pixel: defs.Pixel) => {
  return colors.findIndex((color) => {
    const { r, g, b } = color;
    return r === pixel.r && g === pixel.g && b === pixel.b;
  });
};

/**
 * Map each pixel in a PixelGrid to it's associated minecraft block id and variant.
 */
export const convertPixelGridToMCBlocks = (pixel_grid: defs.PixelGrid, palette: defs.BlockPalette): defs.BlockGrid => {
  const block_counts = new Map<string, number>();

  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const palette_item = palette.find((block) => {
        return findColorIndex(block.colors, pixel) !== -1;
      });

      if (!palette_item) {
        throw new Error('could not find matching block');
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
