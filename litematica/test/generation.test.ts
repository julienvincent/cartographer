import { describe, it, expect } from 'vitest';

import * as litematica from '../src';

describe('schematic-generation', () => {
  it('should generate a schematic file', () => {
    const data = litematica.generateSchematicNBT({
      blocks: [
        {
          id: 'minecraft:stone',
          x: 0,
          y: 0,
          z: 0
        },
        {
          id: 'minecraft:birch_log',
          properties: {
            axis: 'y'
          },
          x: 0,
          y: 1,
          z: 0
        },
        {
          id: 'minecraft:white_wool',
          x: 0,
          y: 0,
          z: 1
        },
        {
          id: 'minecraft:birch_log',
          properties: {
            axis: 'y'
          },
          x: 1,
          y: 0,
          z: 1
        },
        {
          id: 'minecraft:birch_log',
          properties: {
            axis: 'x'
          },
          x: 1,
          y: 1,
          z: 1
        }
      ]
    });

    expect(data).toMatchSnapshot();
  });
});
