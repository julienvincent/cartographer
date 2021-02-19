import * as pixels from '@cartographer/pixels';

export type ColorPaletteItem = {
  colors: pixels.defs.RGBColor[];
  block_ids: string[];
  selected_block_id: string;
  enabled: boolean;
};

export type ColorPalette = ColorPaletteItem[];
