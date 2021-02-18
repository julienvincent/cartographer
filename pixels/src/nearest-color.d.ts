declare module 'nearest-color' {
  export type RGBColor = {
    r: number;
    g: number;
    b: number;
  };
  export type InputColors = Record<string, RGBColor>;

  export type ColorFinder = (
    color: RGBColor | string
  ) => {
    name: string;
    color: string;
    rgb: RGBColor;
  };
  export function from(colors: InputColors): ColorFinder;
}
