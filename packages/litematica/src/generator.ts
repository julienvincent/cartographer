import * as litematica_bit_array from './litematica-bit-array';
import * as _ from 'lodash';

type PaletteBlockProperty = {
  type: 'string';
  value: string;
};
type PaletteBlockProperties = {
  type: 'compound';
  value: Record<string, PaletteBlockProperty>;
};
type PaletteBlock = {
  Name: {
    type: 'string';
    value: string;
  };
  Properties?: PaletteBlockProperties;
};

export type Block = {
  id: string;
  properties?: Record<string, string>;
};

export type Coords = {
  x: number;
  y: number;
  z: number;
};

export type BlockPosition = Block & Coords;

const createPaletteBlock = (block: Block): PaletteBlock => {
  const palette_block: PaletteBlock = {
    Name: {
      type: 'string',
      value: block.id
    }
  };

  if (Object.keys(block.properties || {}).length > 0) {
    palette_block.Properties = {
      type: 'compound',
      value: _.mapValues(block.properties, (value) => {
        return {
          type: 'string',
          value: value
        } as PaletteBlockProperty;
      })
    };
  }

  return palette_block;
};

const comparePaletteBlocks = (a: PaletteBlock, b: PaletteBlock) => {
  if (a.Name.value !== b.Name.value) {
    return false;
  }

  if (a.Properties) {
    const keys = Object.keys(a.Properties.value);
    if (!b.Properties || Object.keys(b.Properties.value).length !== keys.length) {
      return false;
    }
    return keys.reduce((matching, key) => {
      if (!matching) {
        return false;
      }
      return a.Properties!.value[key].value === b.Properties!.value[key]?.value;
    }, true);
  } else {
    if (b.Properties) {
      return false;
    }
  }

  return true;
};

const createIndexKeyFromCoords = (block: Coords) => {
  return `${block.x}:${block.y}:${block.z}`;
};

const max = <T>(coll: T[], accessor: (item: T) => number) => {
  return coll.reduce((acc, item) => {
    const val = accessor(item);
    if (val > acc) {
      return val;
    }
    return acc;
  }, accessor(coll[0]));
};

type Params = {
  blocks: BlockPosition[];
  name?: string;
  description?: string;
  author?: string;
};
export const generateSchematicNBT = (params: Params) => {
  const length = max(params.blocks, (position) => position.z) + 1;
  const width = max(params.blocks, (position) => position.x) + 1;
  const height = max(params.blocks, (position) => position.y) + 1;

  const volume = length * width * height;
  const AIR = createPaletteBlock({
    id: 'minecraft:air'
  });

  const palette = params.blocks.reduce(
    (palette, block) => {
      const palette_block = createPaletteBlock(block);
      const exists = palette.find((existing) => {
        return comparePaletteBlocks(palette_block, existing);
      });
      if (!exists) {
        palette.push(palette_block);
      }
      return palette;
    },
    [AIR]
  );

  const index = new Map<string, Block>(
    params.blocks.map((block) => {
      return [createIndexKeyFromCoords(block), block];
    })
  );

  const bit_array = _.range(width).reduce((bit_array, x) => {
    return _.range(length).reduce((bit_array, z) => {
      return _.range(height).reduce((bit_array, y) => {
        const block = index.get(createIndexKeyFromCoords({ x, y, z }));

        const palette_index = palette.findIndex((item) => {
          if (block) {
            return comparePaletteBlocks(item, createPaletteBlock(block));
          }
          return comparePaletteBlocks(item, AIR);
        });

        const block_coords = (y * length + z) * width + x;
        return litematica_bit_array.set(bit_array, block_coords, palette_index);
      }, bit_array);
    }, bit_array);
  }, litematica_bit_array.createBitArray(volume, palette.length));

  return {
    name: params.name ?? '',
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
            value: params.description ?? ''
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
            value: params.author ?? ''
          },
          TotalVolume: {
            type: 'int',
            value: volume
          },
          Name: {
            type: 'string',
            value: params.name ?? ''
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
                value: bit_array.array
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
