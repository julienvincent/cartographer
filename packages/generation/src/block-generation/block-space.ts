import * as pixels from '@cartographer/pixels';

export type BlockWithCoords = pixels.MCBlockWithHue & {
  x: number;
  y: number;
  z: number;
};

export type BlockSpace = BlockWithCoords[];

type GenerateBlockSpaceParams = {
  block_grid: pixels.BlockGrid;
  support_block_id: string;
};
export const generateBlockSpace = (params: GenerateBlockSpaceParams) => {
  return params.block_grid.reduce((block_space: BlockSpace, row, x) => {
    const init = {
      blocks: [] as BlockSpace,
      support: [] as BlockSpace,
      previous: undefined as BlockWithCoords | undefined
    };

    const { blocks, support, previous } = row.reduce((acc, block, z) => {
      const next = {
        ...block,
        x,
        z,

        // We start the initial block in a strip at y=1 to allow for support blocks below
        y: acc.previous ? acc.previous.y + acc.previous.hue : 1
      };
      acc.blocks.push(next);

      if (block.attributes?.requires_support) {
        acc.support.push({
          id: params.support_block_id,
          hue: 0,
          x,
          y: next.y - 1,
          z
        });
      }

      acc.previous = next;
      return acc;
    }, init);

    block_space.push(...blocks);
    block_space.push(...support);

    // Add a final north block if the last block in the strip has a non-0 hue
    if (previous && previous.hue !== 0) {
      block_space.push({
        id: params.support_block_id,
        hue: 0,
        x: previous.x,
        y: previous.y + 1,
        z: previous.z + 1
      });
    }

    return block_space;
  }, []);
};
