import * as schematic_generation from '../src/schema-generation';
import * as zlib from 'zlib';
import * as fs from 'fs';
import nbt from 'nbt';
import 'jest';

describe('schematic-generation', () => {
  test('it should generate a schematic file', () => {
    const data = schematic_generation.litematica.generateSchematicNBT([
      [
        [
          {
            block_id: 'minecraft:stone',
            height: 0
          },
          {
            block_id: 'minecraft:oak_planks',
            height: 1
          }
        ],
        [
          {
            block_id: 'minecraft:white_wool',
            height: 0
          }
        ]
      ],
      [
        [],
        [
          {
            block_id: 'minecraft:cobblestone',
            height: 0
          }
        ]
      ]
    ]);

    expect(data).toMatchSnapshot();
  });
});
