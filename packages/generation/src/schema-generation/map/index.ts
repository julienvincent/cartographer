import { BlockSpace } from '../../block-generation';
import * as _ from 'lodash';

const getBlockSpaceDimensions = (block_space: BlockSpace) => {
  return block_space.reduce(
    (dimensions, block) => {
      if (block.x > dimensions.width) {
        dimensions.width = block.x;
      }
      if (block.y > dimensions.height) {
        dimensions.height = block.y;
      }
      if (block.z > dimensions.length) {
        dimensions.length = block.z;
      }
      return dimensions;
    },
    { width: 0, height: 0, length: 0 }
  );
};

export const asNbtObject = (space: BlockSpace): object => {
  const { width, height, length } = getBlockSpaceDimensions(space);

  const palette: string[] = [];

  const addToPalette = (sid: string): number => {
    if(sid === 'minecraft:air') {
      return 0;
    }
    let id: number = palette.indexOf(sid);
    if (id === -1) {
      id = palette.length;
      palette.push(sid);
    }
    return id;
  };

  const index = space.reduce((index, block) => {
    index.set(`${block.x}:${block.y}:${block.z}`, block.id);
    return index;
  }, new Map<string, string>());

  const getSid = (x: number, y: number, z: number): string => {
    const id = index.get(`${x}:${y}:${z}`);
    if (!id|| id === 'minecraft:air') {
      return 'minecraft:air';
    }
    return id;
  };

  const blocks = _.range(width).reduce((blocks, x) => {
    return _.range(length).reduce((blocks, z) => {
      return _.range(height).reduce((blocks, y) => {
        if(getSid(x, y, z)==='minecraft:air') {
          return blocks;
        }
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
