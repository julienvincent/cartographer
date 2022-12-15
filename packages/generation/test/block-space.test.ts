import { describe, it, expect } from 'vitest';

import * as pixels from '@cartographer/pixels';
import * as block_generation from '../src/block-generation';

describe('block-space generation', () => {
  it('should generate a flat block space', () => {
    const block: pixels.MCBlockWithHue = {
      id: 'minecraft:stone',
      hue: 0
    };

    const block_space = block_generation.generateBlockSpace({
      block_grid: [
        [block, block, block],
        [block, block, block]
      ],
      support_block_id: ''
    });

    const largest_offset = block_space.reduce((offset, block) => {
      if (block.y > offset) {
        return block.y;
      }
      return offset;
    }, 0);

    expect(largest_offset).toBe(1);
    expect(block_space).toMatchSnapshot();
  });

  it('should generate a symmetrical staircased block space and include a north block', () => {
    const block: pixels.MCBlockWithHue = {
      id: 'minecraft:stone',
      hue: 1
    };

    const block_space = block_generation.generateBlockSpace({
      block_grid: [
        [block, block, block],
        [block, block, block]
      ],
      support_block_id: 'support'
    });

    const largest_offset = block_space.reduce((offset, block) => {
      if (block.y > offset) {
        return block.y;
      }
      return offset;
    }, 0);

    expect(largest_offset).toBe(4);
    expect(block_space).toMatchSnapshot();
  });

  it('should generate varied staircased block space', () => {
    const block: pixels.MCBlockWithHue = {
      id: 'minecraft:stone',
      hue: 1
    };

    const block_space = block_generation.generateBlockSpace({
      block_grid: [
        [
          block,
          {
            ...block,
            hue: 0
          },
          {
            ...block,
            hue: 0
          }
        ],
        [
          {
            ...block,
            hue: 2
          },
          block,
          {
            ...block,
            hue: 0
          }
        ]
      ],
      support_block_id: 'support'
    });

    const largest_offset = block_space.reduce((offset, block) => {
      if (block.y > offset) {
        return block.y;
      }
      return offset;
    }, 0);

    expect(largest_offset).toBe(4);
    expect(block_space).toMatchSnapshot();
  });

  it('should add support under required blocks', () => {
    const block: pixels.MCBlockWithHue = {
      id: 'minecraft:stone',
      attributes: {
        requires_support: true
      },
      hue: 0
    };

    const block_space = block_generation.generateBlockSpace({
      block_grid: [[block], [block]],
      support_block_id: 'support'
    });

    expect(block_space).toMatchSnapshot();
  });
});
