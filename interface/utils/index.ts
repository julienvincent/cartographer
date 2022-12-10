import * as defs from '../defs';
import * as pixels from '@cartographer/pixels';

export const extractImageDataFromFile = (file: File) => {
  const image = new Image();

  return new Promise<ImageData>((resolve) => {
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
      context.drawImage(image, 0, 0, width, height);
      resolve(context.getImageData(0, 0, width, height));
    };

    image.src = URL.createObjectURL(file);
  });
};

export const download = (data: Uint8Array, file_name: string) => {
  const data_url = URL.createObjectURL(
    new Blob([data], {
      type: 'application/octet-stream'
    })
  );

  const a = document.createElement('a') as HTMLAnchorElement;
  a.setAttribute('href', data_url);
  a.setAttribute('style', 'display: none');
  a.setAttribute('download', file_name);

  document.body.appendChild(a);

  a.click();
  a.remove();
};

export const createDefaultPalette = (): defs.ColorPalette => {
  return pixels.data.MC_BLOCK_COLORS.map((mapping) => {
    return {
      colors: mapping.colors.slice(0, 3),
      blocks: mapping.blocks,
      selected_block_id: mapping.blocks[0].id,
      enabled: mapping.blocks[0].id !== 'minecraft:water'
    };
  });
};

export const normalizeColorPalette = (palette: defs.ColorPalette) => {
  return palette
    .filter((item) => item.enabled)
    .map((item) => {
      const block = item.blocks.find((block) => block.id === item.selected_block_id);
      return {
        ...block!,
        colors: item.colors
      };
    });
};
