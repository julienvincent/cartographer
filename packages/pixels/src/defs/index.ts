export type RGBColor = [number, number, number];

export type Pixel = {
  r: number;
  g: number;
  b: number;
};

export type PixelGrid = Pixel[][];

export type BlockAttributes = Record<string, string> & {
  requires_support?: boolean;
  flammable?: boolean;
  liquid?: boolean;
};

export type MCBlockDefinition = {
  /**
   * The minecraft block ID. This will be something like `minecraft:air`
   */
  id: string;

  /**
   * Stores useful attributes about the block that can be used during the schema block space generation
   */
  attributes?: BlockAttributes;

  /**
   * Stores properties about how the block should be placed. This could be things like `{axis: 'y'}` on a
   * directional block such as `minecraft:birch_log` to indicate the direction the block is facing.
   */
  properties?: Record<string, string>;
};

export type MCBlockWithOffset = MCBlockDefinition & {
  y_offset: number;
};

export type MCBlockGrid = MCBlockWithOffset[][];

export type BlockPaletteItem = MCBlockDefinition & {
  colors: RGBColor[];
};
export type BlockPalette = BlockPaletteItem[];

export type ColorPaletteItem = {
  id: string;
  colors: RGBColor[];
  blocks: MCBlockDefinition[];
};
export type ColorPalette = ColorPaletteItem[];

export enum BlockColorSpectrum {
  Full = 'full',
  Flat = 'flat'
}

export type BlockPaletteItem = MCBlock & {
  colors: PaletteColorTuple;
};
export type BlockPalette = BlockPaletteItem[];
