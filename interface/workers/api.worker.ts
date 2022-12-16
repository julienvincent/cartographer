import * as generation from '@cartographer/generation';
import * as pixels from '@cartographer/pixels';
import * as constants from '../constants';
import * as comlink from 'comlink';
import * as defs from '../defs';

export type Transformations = {
  grayscale?: boolean;
  invert?: boolean;
  saturation?: number;
  brightness?: number;
};
export type GenerationParams = {
  image_data: ImageData;

  bounds: defs.Bounds;
  scale: defs.Scale;

  palette: pixels.BlockPalette;
  color_spectrum: pixels.BlockColorSpectrum;

  transformations?: Transformations;
};

const baseImagePipeline = (params: GenerationParams) => {
  const [x, y, dx, dy] = params.bounds;

  const canvas = new OffscreenCanvas(params.image_data.width, params.image_data.height);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  context.putImageData(params.image_data, 0, 0);

  const image_data = context.getImageData(x, y, dx, dy);

  const pixel_grid = pixels.conversion.convertImageDataToPixelGrid(image_data);

  const scaled_pixel_grid = pixels.conversion.scaleDownPixelGrid(
    pixel_grid,
    params.scale.x * constants.SCALE_FACTOR,
    params.scale.y * constants.SCALE_FACTOR
  );

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

const generatePreview = (params: GenerationParams) => {
  const color_converted = baseImagePipeline(params);

  const ratio_xy = params.scale.y / params.scale.x;
  const ratio_yx = params.scale.x / params.scale.y;
  let width, height;
  if (params.scale.x > params.scale.y) {
    width = constants.RENDER_IMAGE_MAX_SIZE;
    height = width * ratio_xy;
  } else {
    height = constants.RENDER_IMAGE_MAX_SIZE;
    width = height * ratio_yx;
  }

  const scaled_up_pixel_grid = pixels.conversion.scaleUpPixelGrid(color_converted, width, height);
  return pixels.conversion.convertPixelGridToImageData(scaled_up_pixel_grid);
};

type BlockGenerationParams = GenerationParams & {
  staircase_alg: generation.block_generation.StaircaseAlgorithm;
  support_block_id: string;
};

const generateBlockSpaceFromImageData = (params: BlockGenerationParams) => {
  const color_converted = baseImagePipeline(params);

  const blocks = pixels.conversion.convertPixelGridToMCBlocks(color_converted, params.palette);
  return generation.block_generation.generateBlockSpace({
    block_grid: blocks,
    support_block_id: params.support_block_id,
    staircase_alg: params.staircase_alg
  });
};

export const generateLightmaticaSchema = async (params: BlockGenerationParams) => {
  const block_space = generateBlockSpaceFromImageData(params);
  const schema = generation.schema_generation.litematica.generateLitematicaSchema(block_space);
  return await generation.serialization.serializeNBTData(schema);
};

export const generateMapNBT = async (params: BlockGenerationParams) => {
  const block_space = generateBlockSpaceFromImageData(params);
  const map = generation.schema_generation.map.asNbtObject(block_space);
  return await generation.serialization.serializeNBTData(map);
};

export const generateMapJSON = async (params: BlockGenerationParams) => {
  const block_space = generateBlockSpaceFromImageData(params);
  return Buffer.from(JSON.stringify(block_space));
};

export const generateMaterialsList = async (params: BlockGenerationParams) => {
  const block_space = generateBlockSpaceFromImageData(params);

  return block_space.reduce((counts: Record<string, number>, block) => {
    counts[block.id] = (counts[block.id] || 0) + 1;
    return counts;
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
