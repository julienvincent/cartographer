import * as _ from 'lodash';

export const getNeededBits = (size: number) => {
  return Math.max(Math.ceil(Math.log2(size)), 2);
};

/**
 * This is a reimplementation of the LitematicaBitArray
 *
 * https://github.com/maruohon/litematica/blob/master/src/main/java/fi/dy/masa/litematica/schematic/container/LitematicaBitArray.java
 */
export class BlockStateStorage {
  size: number;
  maxEntryValue: number;
  arr: number[] = [];

  bitsPerEntry: number;

  roundUp(num: number, interval: number) {
    if (interval == 0) {
      return 0;
    } else if (num == 0) {
      return interval;
    } else {
      if (num < 0) {
        interval *= -1;
      }

      const i = num % interval;
      return i == 0 ? num : num + interval - i;
    }
  }

  constructor(size: number, nbits: number) {
    this.bitsPerEntry = nbits;
    this.size = size;

    this.arr = _.range(this.roundUp(size * nbits, 64)).map(() => 0);
    this.maxEntryValue = (1 << nbits) - 1;
  }

  setAt(index: number, value: number) {
    const startOffset = index * this.bitsPerEntry;
    const startArrIndex = startOffset >> 6;
    const endArrIndex = ((index + 1) * this.bitsPerEntry - 1) >> 6;
    const startBitOffset = startOffset & 0x3f;
    this.arr[startArrIndex] =
      (this.arr[startArrIndex] & ~(this.maxEntryValue << startBitOffset)) |
      ((value & this.maxEntryValue) << startBitOffset);

    if (startArrIndex !== endArrIndex) {
      const endOffset = 64 - startBitOffset;
      const j1 = this.bitsPerEntry - endOffset;
      this.arr[endArrIndex] = ((this.arr[endArrIndex] >>> j1) << j1) | ((value & this.maxEntryValue) >> endOffset);
    }
  }

  getAt(index: number) {
    const startOffset = index * this.bitsPerEntry;
    const startArrIndex = startOffset >> 6;
    const endArrIndex = ((index + 1) * (this.bitsPerEntry - 1)) >> 6;
    const startBitOffset = startOffset & 0x3f;

    if (startArrIndex === endArrIndex) {
      return (this.arr[startArrIndex] >>> startBitOffset) & this.maxEntryValue;
    } else {
      const endOffset = 64 - startBitOffset;
      return ((this.arr[startArrIndex] >>> startBitOffset) | (this.arr[endArrIndex] << endOffset)) & this.maxEntryValue;
    }
  }

  getCounts() {
    const counts: number[] = [];
    for (let i = 0; i < this.size; i++) {
      const value = this.getAt(i);
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }
}
