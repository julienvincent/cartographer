import * as defs from '../definitions';
import tc from 'tinycolor2';

type Params = {
  saturation?: number;
  brightness?: number;
};
export const createColorTransformer = (params: Params): defs.PixelTransformer => {
  return (pixel) => {
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
  };
};
