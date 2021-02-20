import { MCBlockSpace } from '../../block-generation';

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

export const asNbtObject = (space: MCBlockSpace): object => {
  const width = space.length;
  const length = space[0].length;
  const height = getBlockSpaceHeight(space);

  const palette: string[] = ['air'];

  const getPaletteId = (sid: string): number => {
    let id: number = palette.indexOf(sid);
    if (id === -1) {
      id = palette.length;
      palette.push(sid);
    }
    return id;
  };

  const getSid = (x: number, y: number, z: number): string => {
    const pillar = space[x][z];

    for (let b of pillar) {
      if (b.height === y) return b.block_id;
    }

    return 'air';
  };

  const blocks: object[] = (() => {
    const arr: object[] = [];

    for (let y = 0; y < width; y++) {
      for (let z = 0; z < length; z++) {
        for (let x = 0; x < width; x++) {
          arr.push({
            pos: {
              type: 'list',
              value: {
                type: 'int',
                value: [x, y, z]
              }
            },
            state: {
              type: 'int',
              value: getPaletteId(getSid(x, y, z))
            }
          });
        }
      }
    }

    return arr;
  })();

  return {
    name: '',
    value: {
      size: {
        type: 'list',
        value: {
          type: 'int',
          value: [width, height, length]
        }
      },
      entities: {
        type: 'list',
        value: {
          type: 'end',
          value: []
        }
      },
      blocks: {
        type: 'list',
        value: {
          type: 'compound',
          value: blocks
        }
      },
      palette: {
        type: 'list',
        value: {
          type: 'compound',
          value: palette.map((s) => {
            return {
              Name: {
                type: 'string',
                value: 'minecraft:' + s
              }
            };
          })
        }
      },
      DataVersion: {
        type: 'int',
        value: 2584
      }
    }
  };
};
