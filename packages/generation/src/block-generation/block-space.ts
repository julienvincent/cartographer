import * as pixels from '@cartographer/pixels';

export type BlockWithCoords = pixels.MCBlockWithHue & {
  x: number;
  y: number;
  z: number;
};

export type BlockSpace = BlockWithCoords[];

export enum StaircaseAlgorithm {
  Continuous = 'continuous',
  Baseline = 'baseline',
  Boundary = 'boundary',
  Upwards = 'upwards'
}

type CalculateBlockOffsetParams = {
  alg: StaircaseAlgorithm;
  previous?: BlockWithCoords;
  last_reset: number;
};

/**
 * This implements the calculations for the various staircasing strategies.
 *
 * - Continuous: Make continuous staircases that never reset back to y=0. This makes it easier to build but may
 *   reach the maximum build height on large maps.
 * - Baseline: Make staircases that continuously reset to y=0 whenever an opportunity arises. Resets can occur
 *   when:
 *     a) The previous block has a hue of `0` and the staircase is currently in the positive Y axis or;
 *     b) The previous block has a hue of `2` and the staircase is currently in the negative Y axis.
 * - Boundary: Prefer making continuous staircases that never reset except when crossing map boundaries. This
 *   allows for the benefits of Continuous but should prevent maps from reaching the build-height limit. This
 *   defaults to the Baseline algorithm when crossing boundaries.
 * 
 *  - Upwards: Make continuous staircases that never reset back to y=0 but make it so the lowest part is always at y=0.
 */
const calculateBlockOffset = (params: CalculateBlockOffsetParams): number => {
  const { previous } = params;

  if (!previous) {
    return 0;
  }

  const diff = previous.y + previous.hue - 1;

  switch (params.alg) {
    case StaircaseAlgorithm.Continuous: {
      return diff;
    }

    case StaircaseAlgorithm.Baseline: {
      if (previous.y > 0) {
        if (previous.hue === 0) {
          return 0;
        }
      }
      if (previous.y < 0) {
        if (previous.hue === 2) {
          return 0;
        }
      }
      return diff;
    }

    case StaircaseAlgorithm.Boundary: {
      const current_boundary = Math.floor((previous.z - 1) / 128);
      if (current_boundary !== params.last_reset) {
        return calculateBlockOffset({ ...params, alg: StaircaseAlgorithm.Baseline });
      }
      return diff;
    }

    case StaircaseAlgorithm.Upwards: {
      return diff;
    }

  }
};

type GenerateBlockSpaceParams = {
  block_grid: pixels.BlockGrid;

  /**
   * This is the Minecraft block_id of the block to use below other blocks that require support. This
   * will also be used as the final padding north block.
   */
  support_block_id: string;

  /**
   * The strategy to use when staircasing blocks.
   *
   * See the comment on `calculateBlockOffset` for reference on the different values
   */
  staircase_alg: StaircaseAlgorithm;
};

/**
 * Generates a BlockSpace from a BlockGrid. There are a few things to note on the implementation.
 *
 * The x/y of the BlockGrid does not map directly to Minecraft coordinates as X=Z and Y=X meaning that
 * the coordinates are rotated. When mapping over the BlockGrid we perform this rotation naturally by using
 * `width` as X and `height` as Z in the loops definitions.
 *
 * Additionally it is important to note that North is on the negative Z axis and therefore blocks need to be
 * staircased in reverse. A block's height needs to increase as the Z axis decreases, which is unintuitive when
 * reading the below code if missing this context.
 */
export const generateBlockSpace = (params: GenerateBlockSpaceParams) => {
  const width = params.block_grid[0].length;
  const height = params.block_grid.length;

  const block_space: BlockSpace = [];
  for (let x = 0; x < width; x++) {
    let previous: BlockWithCoords | undefined;
    let last_reset = height / 128 - 1;
    let lowest_y = 0;

    for (let z = height - 1; z !== -1; z--) {
      const block = params.block_grid[z][x];

      const next = {
        ...block,
        x,

        // We offset the Z axis in the generated block to allow for placing the final north block at Z=0
        z: z + 1,

        y: calculateBlockOffset({
          alg: params.staircase_alg,
          last_reset,
          previous
        })
      };

      block_space.push(next);

      previous = next;
      if (next.y === 1) {
        last_reset = Math.floor(next.z / 128);
      }

      if (block.attributes?.requires_support) {
        block_space.push({
          id: params.support_block_id,
          hue: 0,
          x: next.x,
          y: next.y - 1,
          z: next.z
        });
      }

      if (next.y < lowest_y) {
        lowest_y = next.y;
      }
    }

    if (previous) {
      block_space.push({
        id: params.support_block_id,
        hue: 0,
        x: previous.x,
        y: previous.y + previous.hue - 1,
        z: previous.z - 1
      });
    }

    //check if we need to shift the blocks up to y=0
    if(params.staircase_alg === StaircaseAlgorithm.Upwards) {
      // Shift all the blocks where x is the same up to y=0 if there are any negative y values
      if (lowest_y < 0) {
        block_space.forEach((block) => {
          if (block.x === x) {
            block.y += Math.abs(lowest_y);
          }
        });
      }
    }
  }

  
  if(params.staircase_alg != StaircaseAlgorithm.Upwards) {
    // Find the lowest Y value in the block space
    const lowest_y = block_space.reduce((y, block) => {
      if (block.y < y) {
        return block.y;
      }
      return y;
    }, 0);

    // If the map traverses into the negative Y's then we shift everything back up to Y=0
    if (lowest_y < 0) {
      const shift_factor = lowest_y * -1;
      return block_space.map((block) => {
        return {
          ...block,
          y: block.y + shift_factor
        };
      });
    }
  }

  return block_space;
};
