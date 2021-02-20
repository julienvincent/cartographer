import * as pixels from '@cartographer/pixels';
import { MCBlockVariant } from '@cartographer/pixels/dist/defs';
import { generateOptimizedStaircase } from './staircase';

export type MCBlock = {
  block_id: string;
  height: number;
};

export type MCBlockSpace = MCBlock[][][];

const defaultNorthBorderBlock: MCBlockVariant = { block_id: 'stone', height_variant: 1 };

export const buildBlockSpace = (mcBlockGrid: pixels.defs.MCBlockGrid): MCBlockSpace => {
  const space: MCBlockSpace = [];
  const width: number = mcBlockGrid[0].length;
  const height: number = mcBlockGrid.length;

  for (let x = 0; x < width; x++) {
    const strip: MCBlockVariant[] = mcBlockGrid.map((a) => a[x]); // to redo
    const staircase: number[] = generateOptimizedStaircase(strip, (s) => s.height_variant);

    space[x] = [defaultNorthBorderBlock].concat(strip).map((v, y) => [{ block_id: v.block_id, height: staircase[y] }]);
  }

  // apply water fixes
  // apply dirt fixes
  // apply lava fixes?

  return space;
};
