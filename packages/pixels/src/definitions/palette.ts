import { MCBlock } from './block';
import { Pixel } from './pixel';

export type BlockHue = 0 | 1 | 2;
export type MCBlockWithHue = MCBlock & {
  hue: BlockHue;
};

export type BlockGrid = MCBlockWithHue[][];

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
