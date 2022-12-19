import { it, expect, describe } from 'vitest';

import * as conversion from '../src/conversion';

describe('pixel conversions', () => {
  it('should correctly convert ImageData to a pixel grid', () => {});

  it('should correctly scale a PixelGrid down', () => {
    const arr = [1, 2];

    expect(arr).toMatchSnapshot();
  });
});
