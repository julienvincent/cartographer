import * as staircase from '../src/staircase';
import 'jest';
import {test, expect, describe} from '@jest/globals'

describe('optimiseStaircase', () => {

  test('it should fucking work', () => {
    const arr = [1,2]

    expect(staircase.optimiseStaircase([2, 1, 2, 3, 2, 1, 0])).toEqual([1, 0, 1, 3, 2, 1, 0])
    expect(staircase.optimiseStaircase([2, 2, 3, 4, 6, 6, 6, 6, 6, 7])).toEqual([0, 0, 1, 2, 3, 3, 3, 3, 3, 4])
  });
});
