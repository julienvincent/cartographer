import { generateOptimizedStaircase } from './staircase';
import * as pixels from '@cartographer/pixels';

export type MCBlockSpace = pixels.defs.MCBlockWithOffset[][][];

const defaultNorthBorderBlock: pixels.defs.MCBlockWithOffset = {
  id: 'minecraft:stone',
  y_offset: 1
};

export const buildBlockSpace = (mcBlockGrid: pixels.defs.MCBlockGrid): MCBlockSpace => {
  const space: MCBlockSpace = [];
  const width: number = mcBlockGrid[0].length;
  const height: number = mcBlockGrid.length;

  for (let x = 0; x < width; x++) {
    const strip = mcBlockGrid.map((a) => a[x]); // to redo
    const staircase: number[] = generateOptimizedStaircase(strip, (s) => s.y_offset);

    space[x] = [defaultNorthBorderBlock].concat(strip).map((v, y) => {
      return [
        {
          ...v,
          y_offset: staircase[y]
        }
      ];
    });
  }

  // apply water fixes
  // apply dirt fixes
  // apply lava fixes?

  return space;
};
