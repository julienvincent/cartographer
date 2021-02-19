import { identity } from 'lodash';

export type RGBColor = [number, number, number];

export type Pixel = {
  r: number;
  g: number;
  b: number;
};

export type PixelGrid = Pixel[][];

export type MCBlockVariant = {
  block_id: string;
  height_variant: number;
};

export type MCBlockGrid = MCBlockVariant[][];
