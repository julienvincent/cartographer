import * as schematic_generation from '../src/nbt-generation';
import * as zlib from 'zlib';
import * as fs from 'fs';
import nbt from 'nbt';
import 'jest';

import * as _ from 'lodash';

const getNeededBits = (palette: string[]) => {
  return Math.max(Math.ceil(Math.log2(palette.length)), 2);
};

class BlockStateStorage {
  size: number;
  mask: number;
  // arr: Uint8Array;
  arr = [];
  nbits: number;

  constructor(size: number, nbits: number) {
    this.nbits = nbits;
    this.size = size;
    const s = Math.ceil((nbits * size) / 64);
    console.log(s);
    this.arr = _.range(s).map(() => 0);
    console.log(this.arr);
    this.mask = (1 << nbits) - 1;
  }

  setItem(index: number, value: number) {
    if (!(0 <= index && index < this.size)) {
      throw new Error('invalid index');
    }

    if (!(0 <= value && value <= this.mask)) {
      throw new Error('invalid value');
    }

    // startOffset = index * self.nbits
    // startArrIndex = startOffset >> 6
    // endArrIndex = ((index + 1) * self.nbits - 1) >> 6
    // startBitOffset = startOffset & 0x3F
    // m = (1 << 64) - 1
    // self.array[startArrIndex] = (self.array[startArrIndex] & ~(self.__mask << startBitOffset) | (value & self.__mask) << startBitOffset) & m
    //
    // if startArrIndex != endArrIndex:
    // endOffset = 64 - startBitOffset;
    // j1 = self.nbits - endOffset;
    // self.array[endArrIndex] = (self.array[endArrIndex] >> j1 << j1 | ( value & self.__mask) >> endOffset) & m

    const start_offset = index * this.nbits;
    const startArrIndex = start_offset >> 6;
    const endArrIndex = ((index + 1) * this.nbits - 1) >> 6;
    const startBitOffset = start_offset & 0x3f;
    const m = (1 << 64) - 1;
    this.arr[startArrIndex] =
      ((this.arr[startArrIndex] & ~(this.mask << startBitOffset)) | ((value & this.mask) << startBitOffset)) & m;

    if (startArrIndex !== endArrIndex) {
      const endOffset = 64 - startBitOffset;
      const j1 = this.nbits - endOffset;
      this.arr[endArrIndex] = (((this.arr[endArrIndex] >> j1) << j1) | ((value & this.mask) >> endOffset)) & m;
    }
  }

  getItem(index: number) {
    /*
        if not 0 <= index < len(self):
            raise IndexError("Invalid index {}".format(index))
        startOffset = index * self.nbits
        startArrIndex = startOffset >> 6
        endArrIndex = ((index + 1) * self.nbits - 1) >> 6
        startBitOffset = startOffset & 0x3F

        if startArrIndex == endArrIndex :
            return self.array[startArrIndex] >> startBitOffset & self.__mask
        else:
            endOffset = 64 - startBitOffset;
            return (self.array[startArrIndex] >> startBitOffset | self.array[endArrIndex] << endOffset) & self.__mask
     */

    if (!(0 <= index && index < this.size)) {
      throw new Error('index out of range');
    }

    const startOffset = index * this.nbits;
    const startArrIndex = startOffset >> 6;
    const endArrIndex = ((index + 1) * this.nbits - 1) >> 6;
    const startBitOffset = startOffset & 0x3f;

    if (startArrIndex === endArrIndex) {
      return (this.arr[startArrIndex] >> startBitOffset) & this.mask;
    }

    const endOffset = 64 - startBitOffset;
    return ((this.arr[startArrIndex] >> startBitOffset) | (this.arr[endArrIndex] << endOffset)) & this.mask;
  }

  toLongArray() {
    /**

     l = []
     m1 = 1 << 63
     m2 = (1 << 64) - 1
     for i in self.array:
       if i & m1 > 0:
         i |= ~m2 # Add the potential infinit 1 prefix for negative numbers
       l.append(i)
     return l


     */

    const l = [];
    const m1 = 1 << 63;
    const m2 = (1 << 64) - 1;

    for (let i = 0; i < this.size; i++) {
      let value = this.getItem(i);
      if ((value & m1) > 0) {
        value |= ~m2;
      }
      l.push(value);
    }
    return l;
  }
}

describe('schematic-generation', () => {
  test('bit packing', () => {
    const nbits = getNeededBits(['air', 'stone', '', '', '']);
    const states = new BlockStateStorage(8, nbits);
    states.setItem(0, 1);
    states.setItem(1, 0);
    states.setItem(5, 0);
    console.log(states.toLongArray());
  });

  test('it should generate a schematic file', () => {
    // {
    //   "Name": {
    //   "type": "string",
    //     "value": "minecraft:air"
    // }
    // },
    // {
    //   "Name": {
    //   "type": "string",
    //     "value": "minecraft:stone"
    // }
    // },
    // {
    //   "Name": {
    //   "type": "string",
    //     "value": "minecraft:white_wool"
    // }
    // },
    // {
    //   "Name": {
    //   "type": "string",
    //     "value": "minecraft:cobblestone"
    // }
    // },
    // {
    //   "Name": {
    //   "type": "string",
    //     "value": "minecraft:oak_planks"
    // }
    // }

    const data = schematic_generation.generateSchematicNBT([
      [
        [
          {
            block_id: 'stone',
            height: 0
          },
          {
            block_id: 'oak_planks',
            height: 1
          }
        ],
        [
          {
            block_id: 'white_wool',
            height: 0
          }
        ]
      ],
      [
        [],
        [
          {
            block_id: 'cobblestone',
            height: 0
          }
        ]
      ]
    ]);

    fs.writeFileSync('thing.litematic', zlib.gzipSync(Buffer.from(nbt.writeUncompressed(data))));

    // expect(data).toMatchSnapshot();
  });

  test('thing', () => {
    // const writer = new nbt.Writer();
    //
    // writer.compound({
    //   cc: { type: 'byte', value: 2 }
    //   // Version: {
    //   //   type: 'string',
    //   //   value: 'hi'
    //   // },
    //   // Name: {
    //   //   type: 'string',
    //   //   value: 'hello'
    //   // }
    // });
    //
    // // const data = writer.getData();
    // // console.log(data);
    //
    // const data = nbt.writeUncompressed({
    //   name: '',
    //   value: {
    //     MinecraftDataVersion: {
    //       type: 'int',
    //       value: 2584
    //     },
    //     Regions: {
    //       type: 'compound',
    //       value: {
    //         mapart: {
    //           type: 'string',
    //           value: "awesome!"
    //         }
    //       }
    //     }
    //   }
    // });
    //
    // nbt.parse(data, (err: any, data: any) => {
    //   console.log(data);
    // });
    //
    // expect(true).toBe(true);
  });
});
