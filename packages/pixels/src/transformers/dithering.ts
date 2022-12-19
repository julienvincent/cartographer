import * as defs from '../definitions';

type ErrorTuple = [factor: number, r: number, g: number, b: number];
export const floydSteinbergDitherTransformer = (transformer: defs.PixelTransformer): defs.PixelTransformer => {
  const error_cache = new Map<string, ErrorTuple[]>();

  const pushError = (tuple: ErrorTuple, x: number, y: number) => {
    const key = `${x}:${y}`;
    const error_tuples = error_cache.get(key);
    if (error_tuples) {
      return error_tuples.push(tuple);
    }
    error_cache.set(key, [tuple]);
  };

  return (pixel, payload) => {
    const key = `${payload.x}:${payload.y}`;
    const errors = error_cache.get(key) || [];
    error_cache.delete(key);

    const old_pixel = errors.reduce((pixel, error) => {
      const [factor, r, g, b] = error;
      return {
        r: pixel.r + (r * factor) / 16,
        g: pixel.g + (g * factor) / 16,
        b: pixel.b + (b * factor) / 16
      };
    }, pixel);

    const new_pixel = transformer(old_pixel, payload);

    const r = pixel.r - new_pixel.r;
    const g = pixel.g - new_pixel.g;
    const b = pixel.b - new_pixel.b;

    pushError([7, r, g, b], payload.x + 1, payload.y);
    pushError([3, r, g, b], payload.x - 1, payload.y + 1);
    pushError([5, r, g, b], payload.x, payload.y + 1);
    pushError([1, r, g, b], payload.x + 1, payload.y + 1);

    return new_pixel;
  };
};
