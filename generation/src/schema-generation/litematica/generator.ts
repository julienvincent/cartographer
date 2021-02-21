import * as litematica_bit_array from './litematica-bit-array';
import { MCBlockSpace } from '../../block-generation';
import * as _ from 'lodash';

const getBlockSpaceHeight = (block_space: MCBlockSpace) => {
  return block_space.reduce((height, columns) => {
    return columns.reduce((height, rows) => {
      return rows.reduce((height, pillar) => {
        if (pillar.height + 1 > height) {
          return pillar.height + 1;
        }
        return height;
      }, height);
    }, height);
  }, 0);
};

type PaletteBlock = {
  Name: {
    type: 'string';
    value: string;
  };
};

export const generateSchematicNBT = (block_space: MCBlockSpace) => {
  const length = block_space[0].length;
  const height = getBlockSpaceHeight(block_space);
  const width = block_space.length;

  const volume = length * width * height;

  const init: PaletteBlock[] = [
    {
      Name: {
        type: 'string',
        value: 'minecraft:air'
      }
    }
  ];
  const palette = block_space.reduce((palette, columns) => {
    return columns.reduce((palette, rows) => {
      return rows.reduce((palette, block) => {
        const exists = palette.find((item) => {
          return item.Name.value === block.block_id;
        });
        if (!exists) {
          palette.push({
            Name: {
              type: 'string',
              value: block.block_id
            }
          });
        }
        return palette;
      }, palette);
    }, palette);
  }, init);

  const bit_array = _.range(width).reduce((bit_array, x) => {
    return _.range(length).reduce((bit_array, z) => {
      return _.range(height).reduce((bit_array, y) => {
        const row = block_space[x][z];
        const block = row?.find((block) => block.height === y);
        const palette_index = palette.findIndex((item) => {
          if (block) {
            return item.Name.value === block.block_id;
          }
          return item.Name.value === `minecraft:air`;
        });

        const block_coords = (y * length + z) * width + x;
        return litematica_bit_array.set(bit_array, block_coords, palette_index);
      }, bit_array);
    }, bit_array);
  }, litematica_bit_array.createBitArray(volume, palette.length));

  return {
    name: '',
    value: {
      MinecraftDataVersion: {
        type: 'int',
        value: 2584
      },
      Version: {
        type: 'int',
        value: 5
      },
      Metadata: {
        type: 'compound',
        value: {
          TimeCreated: {
            type: 'long',
            value: [375, 2023476248] // TODO: Use correct time
          },
          TimeModified: {
            type: 'long',
            value: [375, 2023476248] // TODO: Use correct time
          },
          EnclosingSize: {
            type: 'compound',
            value: {
              x: {
                type: 'int',
                value: width
              },
              y: {
                type: 'int',
                value: height
              },
              z: {
                type: 'int',
                value: length
              }
            }
          },
          Description: {
            type: 'string',
            value: ''
          },
          RegionCount: {
            type: 'int',
            value: 1
          },
          TotalBlocks: {
            type: 'int',
            value: palette.length - 1
          },
          Author: {
            type: 'string',
            value: 'cartographer'
          },
          TotalVolume: {
            type: 'int',
            value: volume
          },
          Name: {
            type: 'string',
            value: 'map'
          }
        }
      },
      Regions: {
        type: 'compound',
        value: {
          map: {
            type: 'compound',
            value: {
              BlockStates: {
                type: 'longArray',
                value: litematica_bit_array.drain(bit_array)
              },
              PendingBlockTicks: {
                type: 'list',
                value: {
                  type: 'end',
                  value: []
                }
              },
              Position: {
                type: 'compound',
                value: {
                  x: {
                    type: 'int',
                    value: 1
                  },
                  y: {
                    type: 'int',
                    value: 0
                  },
                  z: {
                    type: 'int',
                    value: 1
                  }
                }
              },
              BlockStatePalette: {
                type: 'list',
                value: {
                  type: 'compound',
                  value: palette
                }
              },
              Size: {
                type: 'compound',
                value: {
                  x: {
                    type: 'int',
                    value: width
                  },
                  y: {
                    type: 'int',
                    value: height
                  },
                  z: {
                    type: 'int',
                    value: length
                  }
                }
              },
              PendingFluidTicks: {
                type: 'list',
                value: {
                  type: 'end',
                  value: []
                }
              },
              TileEntities: {
                type: 'list',
                value: {
                  type: 'end',
                  value: []
                }
              },
              Entities: {
                type: 'list',
                value: {
                  type: 'end',
                  value: []
                }
              }
            }
          }
        }
      }
    }
  };
};
