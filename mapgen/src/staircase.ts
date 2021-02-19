import * as _ from 'lodash';

export const generateOptimizedStaircase = <T>(pixelStrip: T[], getShade: (p: T) => number): number[] => {
  const staircase: number[] = bruteForceStaircase(pixelStrip, getShade);
  optimiseStaircase(staircase);
  return staircase;
};

export const bruteForceStaircase = <T>(pixelStrip: T[], getShade: (p: T) => number): number[] => {
  const staircase: number[] = new Array(pixelStrip.length + 1);
  staircase[0] = 0;

  for (let i = 0; i < pixelStrip.length; i++) {
    switch (getShade(pixelStrip[i])) {
      case 0:
        staircase[i + 1] = staircase[i] - 1;
        break;
      case 1:
        staircase[i + 1] = staircase[i];
        break;
      case 2:
        staircase[i + 1] = staircase[i] + 1;
        break;
    }
  }

  const min = Math.min.apply(null, staircase); //performance
  return staircase.map((s) => s - min);
};

export const optimiseStaircase = (staircase: number[]): number[] => {
  type Stair = { north: number; south: number };
  const heightMap: Stair[][] = [];

  for (let i = 0; i < staircase.length; i++) {
    const stair: Stair = { north: i, south: i };
    while (i + 1 < staircase.length && staircase[i + 1] == staircase[i]) {
      stair.south = ++i;
    }

    const group = heightMap[staircase[i]] || [];
    group.push(stair);
    heightMap[staircase[i]] = group;
  }

  for (const group of heightMap) {
    if (group == null) continue;
    for (const stair of group) {
      const n = stair.north;
      const s = stair.south;

      const min = Math.max(
        n - 1 >= 0 && staircase[n - 1] < staircase[n] ? staircase[n - 1] + 1 : 0,
        s + 1 < staircase.length && staircase[s + 1] < staircase[s] ? staircase[s + 1] + 1 : 0
      );

      for (const i of _.range(n, s + 1)) {
        staircase[i] = min;
      }
    }
  }

  return staircase;
};
