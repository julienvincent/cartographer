export type Pixel = {
  r: number;
  g: number;
  b: number;
};

export type PixelGrid = Pixel[][];

type TransformerPayload = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type PixelTransformer = (pixel: Pixel, payload: TransformerPayload) => Pixel;
