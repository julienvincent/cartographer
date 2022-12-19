import * as defs from '../definitions';
import * as _ from 'lodash';

const average = <T>(datums: T[], getter: (datum: T) => number) => {
  const sum = datums.reduce((acc, datum) => {
    return acc + getter(datum);
  }, 0);
  return Math.ceil(sum / datums.length);
};

/**
 * Pack a given grid of Pixels into a flat ImageData datastructure. This is the format used by browser canvases to read and
 * write images.
 *
 * This also performs up-scaling by linearly scaling a pixel up into a square shape.
 */
export const convertPixelGridToImageData = (pixel_grid: defs.PixelGrid, width: number, height: number) => {
  const source_width = pixel_grid[0].length;
  const source_height = pixel_grid.length;
  const width_pixel_scale = width / source_width;
  const height_pixel_scale = height / source_height;

  const image_data = new ImageData(width, height);
  for (let target_y = 0; target_y < height; target_y++) {
    for (let target_x = 0; target_x < width; target_x++) {
      const pixel_y = Math.floor(target_y / height_pixel_scale);
      const pixel_x = Math.floor(target_x / width_pixel_scale);

      const i = target_y * width * 4 + target_x * 4;
      const { r, g, b } = pixel_grid[pixel_y][pixel_x];

      image_data.data[i] = r;
      image_data.data[i + 1] = g;
      image_data.data[i + 2] = b;
      image_data.data[i + 3] = 255;
    }
  }

  return image_data;
};

type ProcessImageDataParams = {
  image_data: ImageData;

  target_width: number;
  target_height: number;

  transformers: defs.PixelTransformer[];
};

/**
 * Convert a given browser-native ImageData object into a grid of `Pixel`s while performing per-pixel transformations
 * and down-scaling on the overall image.
 *
 * The scaling works by creating quadrants in the source ImageData and averaging the pixels in each quadrant together. Each
 * quadrant maps to a single pixel in the target pixel grid.
 *
 * The output is essentially a conversion of a flat array of numbers sequentially ordered as r,g,b,a into a multidimensional
 * array of Pixels.
 *
 * [r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a]
 * ->>
 * [[Pixel, Pixel], [Pixel, Pixel]]
 */
export const scaleAndProcessImageData = (params: ProcessImageDataParams) => {
  const source_width = params.image_data.width;
  const source_height = params.image_data.height;

  const x_scale = source_width / params.target_width;
  const y_scale = source_height / params.target_height;

  const pixel_grid: defs.PixelGrid = [];

  for (let target_y = 0; target_y < params.target_height; target_y++) {
    for (let target_x = 0; target_x < params.target_width; target_x++) {
      const pixels: defs.Pixel[] = [];

      const source_y_origin = target_y === 0 ? y_scale : target_y * y_scale;
      const source_x_origin = target_x === 0 ? x_scale : target_x * x_scale;

      const range_min_y = Math.round(source_y_origin - y_scale / 2);
      const range_max_y = Math.round(source_y_origin + y_scale / 2);

      const range_min_x = Math.round(source_x_origin - x_scale / 2);
      const range_max_x = Math.round(source_x_origin + x_scale / 2);

      for (let source_y = range_min_y; source_y < range_max_y; source_y++) {
        for (let source_x = range_min_x; source_x < range_max_x; source_x++) {
          const y_diff_factor = 1 - Math.max(0, Math.abs(source_y - source_y_origin) - range_max_y);
          const x_diff_factor = 1 - Math.max(0, Math.abs(source_x - source_x_origin) - range_max_x);

          const i = source_y * source_width * 4 + source_x * 4;
          const r = params.image_data.data[i];
          const g = params.image_data.data[i + 1];
          const b = params.image_data.data[i + 2];

          pixels.push({
            r: r * y_diff_factor * x_diff_factor,
            g: g * y_diff_factor * x_diff_factor,
            b: b * y_diff_factor * x_diff_factor
          });
        }
      }

      const pixel = {
        r: average(pixels, (pixel) => pixel.r),
        g: average(pixels, (pixel) => pixel.g),
        b: average(pixels, (pixel) => pixel.b)
      };

      if (!pixel_grid[target_y]) {
        pixel_grid[target_y] = [];
      }

      const payload = {
        x: target_x,
        y: target_y,
        width: params.target_width,
        height: params.target_height
      };
      pixel_grid[target_y][target_x] = params.transformers.reduce((pixel, transformer) => {
        return transformer(pixel, payload);
      }, pixel);
    }
  }

  return pixel_grid;
};
