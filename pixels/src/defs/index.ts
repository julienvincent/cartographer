export type RGBColor = [number, number, number];

export type Pixel = {
  r: number;
  g: number;
  b: number;
};

export type PixelGrid = Pixel[][];

export type MCBlockDefinition = {
  id: string;
  properties?: Record<string, string>;
};

export type MCBlockWithOffset = MCBlockDefinition & {
  y_offset: number;
};

export type MCBlockGrid = MCBlockWithOffset[][];
