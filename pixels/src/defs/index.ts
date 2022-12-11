export type RGBColor = [number, number, number];

export type Pixel = {
  r: number;
  g: number;
  b: number;
};

export type PixelGrid = Pixel[][];

export type BlockProperties = Record<string, string> & {
  falling?: boolean;
  liquid?: boolean;
};
export type MCBlockDefinition = {
  id: string;
  properties?: BlockProperties;
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
