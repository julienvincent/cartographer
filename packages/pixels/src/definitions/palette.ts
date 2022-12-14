import { MCBlock } from './block';
import { Pixel } from './pixel';

export type MCBlockWithOffset = MCBlock & {
  offset: number;
};

export type BlockGrid = MCBlockWithOffset[][];

export type PaletteColorTuple = [light: Pixel, medium: Pixel, dark: Pixel];

export type BlockPaletteItem = {
  id: string;
  colors: PaletteColorTuple;
  blocks: MCBlock[];
};
export type BlockPalette = BlockPaletteItem[];

export enum BlockColorSpectrum {
  Full = 'full',
  Flat = 'flat'
}
