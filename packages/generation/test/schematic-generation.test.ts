import { describe, it, expect } from 'vitest';

import * as schematic_generation from '../src/schema-generation';

describe('schematic-generation', () => {
  it('should generate a schematic file', () => {
    const data = schematic_generation.litematica.generateLitematicaSchema([
      {
        id: 'minecraft:stone',
        hue: 0,
        x: 0,
        y: 0,
        z: 0
      },
      {
        id: 'minecraft:birch_log',
        properties: {
          axis: 'y'
        },
        hue: 0,
        x: 0,
        y: 1,
        z: 0
      },

      {
        id: 'minecraft:white_wool',
        hue: 0,
        x: 0,
        y: 0,
        z: 1
      },

      {
        id: 'minecraft:birch_log',
        properties: {
          axis: 'y'
        },
        hue: 0,
        x: 1,
        y: 0,
        z: 1
      },
      {
        id: 'minecraft:birch_log',
        properties: {
          axis: 'x'
        },
        hue: 0,
        x: 1,
        y: 1,
        z: 1
      }
    ]);

    expect(data).toMatchSnapshot();
  });
});
