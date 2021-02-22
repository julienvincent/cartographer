import * as pixels from '@cartographer/pixels';

export type ColorPaletteItem = {
  blocks: pixels.defs.MCBlockDefinition[];
  colors: pixels.defs.RGBColor[];
  selected_block_id: string;
  enabled: boolean;
};

export type ColorPalette = ColorPaletteItem[];
