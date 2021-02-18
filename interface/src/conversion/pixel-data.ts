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
export const convertImageDataToPixelGrid = (
  image_data: ImageData
): defs.PixelGrid => {
  const pixels = _.chunk(image_data.data, 4).map((pixel) => {
    const [r, g, b] = pixel;
    return {
      r,
      g,
      b,
    };
  });

  return _.chunk(pixels, image_data.width);
};

export const convertPixelGridToImageData = (pixel_grid: defs.PixelGrid) => {
  const width = pixel_grid[0].length;
  const height = pixel_grid.length;

  return pixel_grid.reduce((image_data, pixels, h) => {
    return pixels.reduce((image_data, pixel, w) => {
      const i = h * height * 4 + w * 4;
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
export const scaleDownPixelGrid = (
  pixel_grid: defs.PixelGrid,
  width: number,
  height: number
) => {
  const source_width = pixel_grid[0].length;
  const source_height = pixel_grid.length;
  const width_pixel_scale = Math.ceil(source_width / width);
  const height_pixel_scale = Math.ceil(source_height / height);

  return _.range(height).map((target_height) => {
    return _.range(width).map((target_width) => {
      const pixels: defs.Pixel[] = [];

      for (let diff_h = 0; diff_h < height_pixel_scale; diff_h++) {
        for (let diff_w = 0; diff_w < width_pixel_scale; diff_w++) {
          const pixel_h = target_height * height_pixel_scale + diff_h;
          const pixel_w = target_width * width_pixel_scale + diff_w;
          const pixel = pixel_grid[pixel_h][pixel_w];
          pixels.push(pixel);
        }
      }

      return {
        r: average(pixels, (pixel) => pixel.r),
        g: average(pixels, (pixel) => pixel.g),
        b: average(pixels, (pixel) => pixel.b),
      };
    });
  });
};

export const scaleUpPixelGrid = (
  pixel_grid: defs.PixelGrid,
  width: number,
  height: number
) => {
  const source_width = pixel_grid[0].length;
  const source_height = pixel_grid.length;
  const width_pixel_scale = width / source_width;
  const height_pixel_scale = height / source_height;

  return _.range(height).map((target_height) => {
    return _.range(width).map((target_width) => {
      const pixel_h = Math.floor(target_height / height_pixel_scale);
      const pixel_w = Math.floor(target_width / width_pixel_scale);
      return pixel_grid[pixel_h][pixel_w];
    });
  });
};
