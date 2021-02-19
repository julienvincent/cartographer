import * as conversion from '../src/staircase';
import 'jest';
import {test, expect, describe} from '@jest/globals'

describe('optimiseStaircase', () => {

  test('it should fucking work', () => {
    const arr = [1,2]

    expect(conversion.optimiseStaircase([2, 1, 2, 3, 2, 1, 0])).toEqual([1, 0, 1, 3, 2, 1, 0])
  });
});
