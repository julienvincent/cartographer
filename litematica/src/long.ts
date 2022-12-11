export type Long = [number, number];

const mask = 0xffffffff;

export const and = (a: Long, b: Long): Long => {
  return [a[0] & b[0], a[1] & b[1]];
};

export const or = (a: Long, b: Long): Long => {
  return [a[0] | b[0], a[1] | b[1]];
};

export const not = (a: Long): Long => {
  return [~a[0] & mask, ~a[1] & mask];
};

export const shiftLeft = (a: Long, shift: number): Long => {
  if (shift < 32) {
    const carryOver = (a[1] & (mask << (32 - shift)) & mask) >>> (32 - shift);

    return [((a[0] << shift) | carryOver) & mask, (a[1] << shift) & mask];
  } else {
    return [a[1] << (shift - 32), 0];
  }
};

export const shiftRight = (a: Long, shift: number): Long => {
  if (shift < 32) {
    const carryOver = (a[0] & (mask >>> (32 - shift))) << (32 - shift);

    return [a[0] >>> shift, (a[1] >>> shift) | carryOver];
  } else {
    return [0, a[0] >>> shift];
  }
};
