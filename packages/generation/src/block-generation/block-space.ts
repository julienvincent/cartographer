import { generateOptimizedStaircase } from './staircase';
import * as pixels from '@cartographer/pixels';

export type MCBlockSpace = pixels.MCBlockWithOffset[][][];

const defaultNorthBorderBlock: pixels.MCBlockWithOffset = {
  id: 'minecraft:stone',
  offset: 1
};

export const buildBlockSpace = (mcBlockGrid: pixels.BlockGrid): MCBlockSpace => {
  const space: MCBlockSpace = [];
  const width: number = mcBlockGrid[0].length;
  const height: number = mcBlockGrid.length;

  for (let x = 0; x < width; x++) {
    const strip = mcBlockGrid.map((a) => a[x]); // to redo
    const staircase: number[] = generateOptimizedStaircase(strip, (s) => s.offset);

    space[x] = [defaultNorthBorderBlock].concat(strip).map((v, y) => {
      return [
        {
          ...v,
          offset: staircase[y]
        }
      ];
    });
  }

  // apply water fixes
  // apply dirt fixes
  // apply lava fixes?

  return space;
};
