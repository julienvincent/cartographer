import * as conversion from '../src/conversion';
import 'jest';

describe('pixel conversions', () => {
  test('it should correctly convert ImageData to a pixel grid', () => {});

  test('it should correctly scale a PixelGrid down', () => {
    console.log('done!');

    const arr = [1,2]

    expect(arr).toMatchSnapshot()
  });
});