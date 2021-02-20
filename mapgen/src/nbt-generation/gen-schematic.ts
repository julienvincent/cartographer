import { MCBlockSpace } from '../blockgen';
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

export const generateSchematicNBT = (block_space: MCBlockSpace) => {
  const length = block_space[0].length;
  const height = getBlockSpaceHeight(block_space);
  const width = block_space.length;

  const init: string[] = [];
  const blocks = _.range(width).reduce((blocks, x) => {
    return _.range(length).reduce((blocks, z) => {
      const row = block_space[x][z];

      return _.range(height).reduce((blocks, y) => {
        const block = row?.find((block) => block.height === y);

        const i = (y * length + z) * width + x;

        if (!block) {
          blocks[i] = 'air';
        } else {
          blocks[i] = block.block_id;
        }

        return blocks;
      }, blocks);
    }, blocks);
  }, init);

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
            value: [375, -1131358791]
          },
          TimeModified: {
            type: 'long',
            value: [375, -1131358791]
          },
          EnclosingSize: {
            type: 'compound',
            value: {
              x: {
                type: 'int',
                value: 2
              },
              y: {
                type: 'int',
                value: 2
              },
              z: {
                type: 'int',
                value: 2
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
            value: 4
          },
          Author: {
            type: 'string',
            value: 'Shmebbles'
          },
          TotalVolume: {
            type: 'int',
            value: 8
          },
          Name: {
            type: 'string',
            value: 'simple'
          }
        }
      },
      Regions: {
        type: 'compound',
        value: {
          simple: {
            type: 'compound',
            value: {
              BlockStates: {
                type: 'longArray',
                value: []
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
                  value: [
                    {
                      Name: {
                        type: 'string',
                        value: 'minecraft:air'
                      }
                    },
                    {
                      Name: {
                        type: 'string',
                        value: 'minecraft:stone'
                      }
                    },
                    {
                      Name: {
                        type: 'string',
                        value: 'minecraft:white_wool'
                      }
                    },
                    {
                      Name: {
                        type: 'string',
                        value: 'minecraft:cobblestone'
                      }
                    },
                    {
                      Name: {
                        type: 'string',
                        value: 'minecraft:oak_planks'
                      }
                    }
                  ]
                }
              },
              Size: {
                type: 'compound',
                value: {
                  x: {
                    type: 'int',
                    value: -2
                  },
                  y: {
                    type: 'int',
                    value: 2
                  },
                  z: {
                    type: 'int',
                    value: -2
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
            value: [375, 2023476248]
          },
          TimeModified: {
            type: 'long',
            value: [375, 2023476248]
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
            value: blocks.filter((block) => block !== 'air').length
          },
          Author: {
            type: 'string',
            value: 'Shmebbles'
          },
          TotalVolume: {
            type: 'int',
            value: blocks.length
          },
          Name: {
            type: 'string',
            value: 'simple'
          }
        }
      },
      Regions: {
        type: 'compound',
        value: {
          simple: {
            type: 'compound',
            value: {
              BlockStates: {
                type: 'longArray',
                value: []
                // value: blocks.map(() => [0, 0])
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
                  value: blocks.map((block) => {
                    return {
                      Name: {
                        type: 'string',
                        value: `minecraft:${block}`
                      }
                    };
                  })
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
