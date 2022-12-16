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
      support_block_id: '',
      staircase_alg: block_generation.StaircaseAlgorithm.Continuous
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
        [block, block, block],
        [block, block, block]
      ],
      support_block_id: 'support',
      staircase_alg: block_generation.StaircaseAlgorithm.Continuous
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
      support_block_id: 'support',
      staircase_alg: block_generation.StaircaseAlgorithm.Continuous
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
      support_block_id: 'support',
      staircase_alg: block_generation.StaircaseAlgorithm.Continuous
    });

    expect(block_space).toMatchSnapshot();
  });

  it.only('should reset staircase offset to baseline', () => {
    const make = (hue: pixels.BlockHue): pixels.MCBlockWithHue => {
      return {
        id: 'minecraft:stone',
        hue
      };
    };

    const block_space = block_generation.generateBlockSpace({
      block_grid: [
        [make(1)],
        [make(2)],
        [make(1)],
        [make(0)], // Here we should see a reset
        [make(1)],
        [make(2)],
        [make(0)], // Here we should see a reset
        [make(1)]
      ],
      support_block_id: '',
      staircase_alg: block_generation.StaircaseAlgorithm.Baseline
    });

    expect(block_space).toMatchSnapshot();
  });
});
