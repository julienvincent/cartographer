import { MCBlockSpace } from '../../block-generation';
import * as _ from 'lodash';

const getBlockSpaceHeight = (block_space: MCBlockSpace) => {
  return block_space.reduce((height, columns) => {
    return columns.reduce((height, rows) => {
      return rows.reduce((height, pillar) => {
        if (pillar.offset + 1 > height) {
          return pillar.offset + 1;
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

  const palette: string[] = ['minecraft:air'];

  const addToPalette = (sid: string): number => {
    let id: number = palette.indexOf(sid);
    if (id === -1) {
      id = palette.length;
      palette.push(sid);
    }
    return id;
  };

  const getSid = (x: number, y: number, z: number): string => {
    const pillar = space[x][z];

    for (const b of pillar) {
      if (b.offset === y) {
        return b.id;
      }
    }

    return 'minecraft:air';
  };

  const blocks = _.range(width).reduce((blocks, x) => {
    return _.range(length).reduce((blocks, z) => {
      return _.range(height).reduce((blocks, y) => {
        blocks.push({
          pos: {
            type: 'list',
            value: {
              type: 'int',
              value: [x, y, z]
            }
          },
          state: {
            type: 'int',
            value: addToPalette(getSid(x, y, z))
          }
        });
        return blocks;
      }, blocks);
    }, blocks);
  }, [] as object[]);

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
                value: s
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
