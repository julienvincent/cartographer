import * as pixels from '@cartographer/pixels';

export type ColorPaletteItem = pixels.defs.ColorPaletteItem & {
  selected_block_id: string;
  enabled: boolean;
};

export type ColorPalette = ColorPaletteItem[];
