import * as pixels from '@cartographer/pixels';

type PaletteSelectionProperties = {
  selected_block_id: string;
  enabled: boolean;
};

export type ColorPaletteItem = pixels.defs.ColorPaletteItem & PaletteSelectionProperties;

export type ColorPalette = ColorPaletteItem[];

export type PalettePatch = Array<Partial<PaletteSelectionProperties> & { id: string }>;
