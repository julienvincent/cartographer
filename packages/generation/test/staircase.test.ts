import { describe, it, expect } from 'vitest';

import * as block_generation from '../src/block-generation';

describe('optimiseStaircase', () => {
  it('should work', () => {
    expect(block_generation.optimiseStaircase([2, 1, 2, 3, 2, 1, 0])).toEqual([1, 0, 1, 3, 2, 1, 0]);
    expect(block_generation.optimiseStaircase([2, 2, 3, 4, 6, 6, 6, 6, 6, 7])).toEqual([0, 0, 1, 2, 3, 3, 3, 3, 3, 4]);
  });
});
