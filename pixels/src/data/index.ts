import color_mapping from './color-mapping.json';
import * as defs from '../defs';

export const MC_BLOCK_COLORS = color_mapping as {
  block_ids: string[];
  colors: defs.RGBColor[];
}[];
