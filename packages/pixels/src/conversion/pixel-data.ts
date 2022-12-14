import * as defs from '../defs';
import * as _ from 'lodash';

function average<T>(datums: T[], getter: (datum: T) => number) {
  const sum = datums.reduce((acc, datum) => {
    return acc + getter(datum);
  }, 0);
  return Math.ceil(sum / datums.length);
}

/**
 * Convert a given browser-native ImageData object into a grid of `Pixel`s
 *
 * This essentially converts a flat array of numbers sequentially ordered as r,g,b,a into a
 * multidimensional array of Pixel maps.
 *
 * [r,g,b,a,  r,g,b,a,  r,g,b,a,  r,g,b,a]
 * ->>
 * [[Pixel, Pixel], [Pixel, Pixel]]
 *
 * This makes working with the data in later steps much easier
 */
export const convertImageDataToPixelGrid = (image_data: ImageData): defs.PixelGrid => {
  const pixels = _.chunk(image_data.data, 4).map((pixel) => {
    const [r, g, b] = pixel;
    return {
      r,
      g,
      b
    };
  });

  return _.chunk(pixels, image_data.width);
};

export const convertPixelGridToImageData = (pixel_grid: defs.PixelGrid) => {
  const width = pixel_grid[0].length;
  const height = pixel_grid.length;

  return pixel_grid.reduce((image_data, pixels, h) => {
    return pixels.reduce((image_data, pixel, w) => {
      const i = h * width * 4 + w * 4;
      const { r, g, b } = pixel;
      image_data.data[i] = r;
      image_data.data[i + 1] = g;
      image_data.data[i + 2] = b;
      image_data.data[i + 3] = 255;
      return image_data;
    }, image_data);
  }, new ImageData(width, height));
};

/**
 * Attempt to scale a given pixel grid down to a given target width/height. This works by creating
 * quadrants in the source pixel grid and averaging the pixels in each quadrant together
 */
export const scaleDownPixelGrid = (pixel_grid: defs.PixelGrid, width: number, height: number) => {
  const source_width = pixel_grid[0].length;
  const source_height = pixel_grid.length;

  const x_scale = source_width / width;
  const y_scale = source_height / height;

  return _.range(height).map((target_y) => {
    return _.range(width).map((target_x) => {
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

          const { r, g, b } = pixel_grid[source_y][source_x];
          pixels.push({
            r: r * y_diff_factor * x_diff_factor,
            g: g * y_diff_factor * x_diff_factor,
            b: b * y_diff_factor * x_diff_factor
          });
        }
      }

      return {
        r: average(pixels, (pixel) => pixel.r),
        g: average(pixels, (pixel) => pixel.g),
        b: average(pixels, (pixel) => pixel.b)
      };
    });
  });
};

export const scaleUpPixelGrid = (pixel_grid: defs.PixelGrid, width: number, height: number) => {
  const source_width = pixel_grid[0].length;
  const source_height = pixel_grid.length;
  const width_pixel_scale = width / source_width;
  const height_pixel_scale = height / source_height;

  return _.range(height).map((target_height) => {
    return _.range(width).map((target_width) => {
      const pixel_w = Math.floor(target_width / width_pixel_scale);
      const pixel_h = Math.floor(target_height / height_pixel_scale);
      return pixel_grid[pixel_h][pixel_w];
    });
  });
};
