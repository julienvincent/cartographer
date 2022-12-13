import * as generation from '@cartographer/generation';
import * as pixels from '@cartographer/pixels';
import * as comlink from 'comlink';
import * as defs from '../defs';

type BaseImagePipelineParams = {
  pixels: pixels.defs.PixelGrid;
  scale: defs.MAP_SCALE;

  palette: pixels.defs.BlockPalette;
  color_spectrum: pixels.defs.BlockColorSpectrum;

  transformations?: {
    grayscale?: boolean;
    invert?: boolean;
    saturation?: number;
    brightness?: number;
  };
};
const baseImagePipeline = (params: BaseImagePipelineParams) => {
  const scaled_pixel_grid = pixels.conversion.scaleDownPixelGrid(params.pixels, params.scale, params.scale);

  let transformed = scaled_pixel_grid;
  if (params.transformations) {
    transformed = pixels.transformers.alterColorationProperties(transformed, {
      brightness: params.transformations.brightness,
      saturation: params.transformations.saturation
    });
    if (params.transformations.invert) {
      transformed = pixels.transformers.invert(transformed);
    }
    if (params.transformations.grayscale) {
      transformed = pixels.transformers.applyGrayScale(transformed);
    }
  }

  return pixels.conversion.convertPixelGridColorsForMC(transformed, {
    palette: params.palette,
    color_spectrum: params.color_spectrum
  });
};

type GeneratePreviewParams = Omit<BaseImagePipelineParams, 'pixels'> & {
  image_data: ImageData;
  bounds: defs.Bounds;
};
const generatePreview = (params: GeneratePreviewParams) => {
  const preview_scale = 640;

  const [x, y, d] = params.bounds;

  const canvas = new OffscreenCanvas(params.image_data.width, params.image_data.height);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  context.putImageData(params.image_data, 0, 0);

  const image_data = context.getImageData(x, y, d, d);

  const pixel_grid = pixels.conversion.convertImageDataToPixelGrid(image_data);
  const color_converted = baseImagePipeline({
    pixels: pixel_grid,
    palette: params.palette,
    scale: params.scale,
    color_spectrum: params.color_spectrum,
    transformations: params.transformations
  });

  const scaled_up_pixel_grid = pixels.conversion.scaleUpPixelGrid(color_converted, preview_scale, preview_scale);
  return pixels.conversion.convertPixelGridToImageData(scaled_up_pixel_grid);
};

type GenerateBlockSpaceFromImageDataParams = Omit<BaseImagePipelineParams, 'pixels'> & {
  image_data: ImageData;
};
const generateBlockSpaceFromImageData = (params: GenerateBlockSpaceFromImageDataParams) => {
  const pixel_grid = pixels.conversion.convertImageDataToPixelGrid(params.image_data);

  const color_converted = baseImagePipeline({
    pixels: pixel_grid,
    palette: params.palette,
    scale: params.scale,
    color_spectrum: params.color_spectrum,
    transformations: params.transformations
  });

  const blocks = pixels.conversion.convertPixelGridToMCBlocks(color_converted, params.palette);
  return generation.block_generation.buildBlockSpace(blocks);
};

export const generateLightmaticaSchema = async (params: GenerateBlockSpaceFromImageDataParams) => {
  const block_space = generateBlockSpaceFromImageData(params);
  const schema = generation.schema_generation.litematica.generateLitematicaSchema(block_space);
  return await generation.serialization.serializeNBTData(schema);
};

export const generateMapNBT = async (params: GenerateBlockSpaceFromImageDataParams) => {
  const block_space = generateBlockSpaceFromImageData(params);
  const map = generation.schema_generation.map.asNbtObject(block_space);
  return await generation.serialization.serializeNBTData(map);
};

export const generateMapJSON = async (params: GenerateBlockSpaceFromImageDataParams) => {
  const block_space = generateBlockSpaceFromImageData(params);
  return Buffer.from(JSON.stringify(block_space));
};

export const generateMaterialsList = async (params: GenerateBlockSpaceFromImageDataParams) => {
  const block_space = generateBlockSpaceFromImageData(params);

  return block_space.reduce((counts: Record<string, number>, rows) => {
    return rows.reduce((counts, row) => {
      return row.reduce((counts, block) => {
        counts[block.id] = (counts[block.id] || 0) + 1;
        return counts;
      }, counts);
    }, counts);
  }, {});
};

const API = {
  generatePreview: generatePreview,
  generateLitematicaSchema: generateLightmaticaSchema,
  generateMapNBT: generateMapNBT,
  generateMapJSON: generateMapJSON,
  generateMaterialsList: generateMaterialsList
};

export type API = typeof API;

comlink.expose(API);
