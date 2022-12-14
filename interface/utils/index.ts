import * as block_palettes from '@cartographer/block-palettes';
import * as defs from '../defs';

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

export const createDefaultPalette = (patch: defs.PalettePatch): defs.ColorPalette => {
  const indexed = Object.fromEntries(patch.map((patch) => [patch.id, patch]));
  return block_palettes.palettes['1.19'].map((mapping) => {
    const block_patch = indexed[mapping.id];
    return {
      id: mapping.id,
      colors: mapping.colors,
      blocks: mapping.blocks,
      selected_block_id: block_patch?.selected_block_id ?? mapping.blocks[0].id,
      enabled: block_patch?.enabled ?? true
    };
  });
};

export const normalizeColorPalette = (palette: defs.ColorPalette) => {
  return palette
    .filter((item) => item.enabled)
    .map((item) => {
      const blocks = item.blocks.filter((block) => block.id === item.selected_block_id);
      return {
        ...item,
        blocks,
        colors: item.colors
      };
    });
};
