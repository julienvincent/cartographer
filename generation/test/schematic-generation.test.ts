import { describe, it, expect } from 'vitest';

import * as schematic_generation from '../src/schema-generation';

describe('schematic-generation', () => {
  it('should generate a schematic file', () => {
    const data = schematic_generation.litematica.generateSchematicNBT([
      [
        [
          {
            id: 'minecraft:stone',
            y_offset: 0
          },
          {
            id: 'minecraft:birch_log',
            properties: {
              axis: 'y'
            },
            y_offset: 1
          }
        ],
        [
          {
            id: 'minecraft:white_wool',
            y_offset: 0
          }
        ]
      ],
      [
        [],
        [
          {
            id: 'minecraft:birch_log',
            properties: {
              axis: 'y'
            },
            y_offset: 0
          },
          {
            id: 'minecraft:birch_log',
            properties: {
              axis: 'x'
            },
            y_offset: 1
          }
        ]
      ]
    ]);

    expect(data).toMatchSnapshot();
  });
});
