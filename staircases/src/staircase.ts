import * as _ from 'lodash';

export const bruteForceStaircase = <T>(
  pixelStrip: T[],
  getShade: (p: T) => number
): number[] => {
  const staircase: number[] = new Array(pixelStrip.length + 1);
  staircase[0] = 0;

  for (let i = 0; i < pixelStrip.length; i++) {
    switch (getShade(pixelStrip[i])) {
      case 0:
        staircase[i + 1] = staircase[i] - 1;
      case 1:
        staircase[i + 1] = staircase[i];
      case 2:
        staircase[i + 1] = staircase[i] + 1;
    }
  }

  const min = Math.min.apply(null, staircase);
  return staircase.map((s) => s - min);
};

export const optimiseStaircase = (staircase: number[]): number[] => {
  type Stair = { n: number; s: number };
  const heightMap: Stair[][] = [];

  for (let i = 0; i < staircase.length; i++) {
    const stair: Stair = { n: i, s: i };
    while (i + 1 < staircase.length && staircase[i + 1] == staircase[i]) {
      stair.s = ++i;
    }

    const group = heightMap[staircase[i]] || [];
    group.push(stair);
    heightMap[staircase[i]] = group;
  }

  for (const group of heightMap) {
    for (const stair of group) {
      const min = Math.max(
        stair.n - 1 >= 0 && staircase[stair.n - 1] < staircase[stair.n]
          ? staircase[stair.n - 1] + 1
          : 0,
        stair.s + 1 < staircase.length &&
          staircase[stair.s + 1] < staircase[stair.s]
          ? staircase[stair.s + 1] + 1
          : 0
      );

      for (const i of _.range(stair.n, stair.s + 1)) {
        staircase[i] = min;
      }
    }
  }

  return staircase;
};
