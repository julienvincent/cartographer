import * as sg from '../src/schema-generation';
import 'jest';
import { isExportDeclaration } from 'typescript';

describe('schematic-generation', () => {
  test('it should generate a schematic file', () => {
    expect(sg.litematica.longLeftShift([0, 4294967295], 32)).toEqual([-1, 0]);
    expect(sg.litematica.longLeftShift([0, 3], 32)).toEqual([3, 0]);
    expect(sg.litematica.longLeftShift([0, 3], 33)).toEqual([6, 0]);
    expect(sg.litematica.longLeftShift([0, 3], 31)).toEqual([1, -2147483648]);
  });

  test('longRightShift should right shift long numbers correctly', () => {
    expect(sg.litematica.longRightShift([1, 0], 32)).toEqual([0, 1]);
    expect(sg.litematica.longRightShift([1, 0], 1)).toEqual([0, -2147483648]);
    expect(sg.litematica.longRightShift([3, 0], 1)).toEqual([1, -2147483648]);
  });
});
