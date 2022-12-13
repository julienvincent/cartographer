import * as defs from '../defs';
import tc from 'tinycolor2';

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

      return color.toRgb();
    });
  });
};
