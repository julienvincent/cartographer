import * as pixels from '@cartographer/pixels';

type PaletteSelectionProperties = {
  selected_block_ids: string[];
  enabled: boolean;
};

export type ColorPaletteItem = pixels.BlockPaletteItem & PaletteSelectionProperties;

export type ColorPalette = ColorPaletteItem[];

export type PalettePatch = Array<Partial<PaletteSelectionProperties> & { id: string }>;
