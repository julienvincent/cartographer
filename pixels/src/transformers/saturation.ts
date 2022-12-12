import * as defs from '../defs';
import tc from 'tinycolor2';

const getLightnessOfRGB = (color: defs.RGBColor) => {
  const highest = Math.max(...color);
  const lowest = Math.min(...color);

  // Return the average divided by 255
  return (highest + lowest) / 2 / 255;
};

const getLowestMiddleHighest = (color: defs.RGBColor) => {
  let highest = { value: -1, index: -1 };
  let lowest = {
    value: Infinity,
    index: -1
  };

  color.forEach((value, index) => {
    if (value > highest.value) {
      highest = { value, index };
    }
    if (value < lowest.value) {
      lowest = { value, index };
    }
  });

  if (lowest.index === highest.index) {
    lowest.index = highest.index + 1;
  }

  let middle = { value: Infinity, index: 3 - highest.index - lowest.index };
  middle.value = color[middle.index];
  return [lowest, middle, highest];
};

const increaseSaturation = (color: defs.RGBColor, amount: number) => {
  const grayVal = getLightnessOfRGB(color) * 255;
  const [lowest, middle, highest] = getLowestMiddleHighest(color);

  if (lowest.value === highest.value) {
    return color;
  }

  const saturationRange = Math.round(Math.min(255 - grayVal, grayVal));
  const maxChange = Math.min(255 - highest.value, lowest.value);
  const changeAmount = Math.min(saturationRange / amount, maxChange);
  const middleValueRatio = (grayVal - middle.value) / (grayVal - highest.value);

  const saturated = [];
  saturated[highest.index] = Math.round(highest.value + changeAmount);
  saturated[lowest.index] = Math.round(lowest.value - changeAmount);
  saturated[middle.index] = Math.round(grayVal + (saturated[highest.index] - grayVal) * middleValueRatio);

  return saturated;
};

const decreaseSaturation = (color: defs.RGBColor, amount: number) => {
  const [lowest, middle, highest] = getLowestMiddleHighest(color);
  const grayVal = getLightnessOfRGB(color) * 255;

  if (lowest.value === highest.value) {
    return color;
  }

  const saturationRange = Math.round(Math.min(255 - grayVal, grayVal));
  const maxChange = grayVal - lowest.value;
  const changeAmount = Math.min(saturationRange / amount, maxChange);

  const middleValueRatio = (grayVal - middle.value) / (grayVal - highest.value);

  const returnArray = [];
  returnArray[highest.index] = Math.round(highest.value - changeAmount);
  returnArray[lowest.index] = Math.round(lowest.value + changeAmount);
  returnArray[middle.index] = Math.round(grayVal + (returnArray[highest.index] - grayVal) * middleValueRatio);

  return returnArray;
};

type Params = {
  saturation?: number;
  brightness?: number;
};
export const alterColorationProperties = (pixel_grid: defs.PixelGrid, params: Params) => {
  return pixel_grid.map((pixels) => {
    return pixels.map((pixel) => {
      const color = tc(pixel);

      if (params.saturation) {
        if (params.saturation < 0) {
          color.desaturate(params.saturation * -1);
        } else {
          color.saturate(params.saturation);
        }
      }

      if (params.brightness) {
        if (params.brightness < 0) {
          color.darken(params.brightness * -1);
        } else {
          color.lighten(params.brightness);
        }
      }

      const { r, g, b } = color.toRgb();
      return { r, g, b };
      // if (amount < 0) {
      //   const [r, g, b] = decreaseSaturation([pixel.r, pixel.g, pixel.b], amount * -1);
      //   return { r, g, b };
      // }

      // const [r, g, b] = increaseSaturation([pixel.r, pixel.g, pixel.b], amount);
      // return { r, g, b };
    });
  });
};
