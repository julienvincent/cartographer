import * as conversion from './conversion';
import * as React from 'react';

enum CANVAS {
  SOURCE = 'SOURCE',
  TARGET = 'TARGET'
}

enum MAP_SCALE {
  X1 = 128
}
export function Component() {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('dropped');
  };

  const openFileSelector = () => {
    document.getElementById('file')?.click();
  };

  const getCanvas = (id: CANVAS) => {
    return document.getElementById(id) as HTMLCanvasElement;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const canvas = getCanvas(CANVAS.SOURCE);
    const context = canvas.getContext('2d')!;
    const image = new Image();
    image.onload = () => {
      const scale = image.naturalWidth / image.naturalHeight;
      const width = 512;
      // const height = width / scale;
      const height = 512;
      canvas.setAttribute('width', width.toString());
      canvas.setAttribute('height', height.toString());
      context.drawImage(image, 0, 0, width, height);

      const source_image_data = context.getImageData(0, 0, width, height);
      const pixel_grid = conversion.convertImageDataToPixelGrid(
        source_image_data
      );

      const scaled_pixel_grid = conversion.scaleDownPixelGrid(
        pixel_grid,
        MAP_SCALE.X1,
        MAP_SCALE.X1
      );

      const color_converted = conversion.colors.convertPixelGridColorsForMC(
        scaled_pixel_grid
      );

      const gray_scale = conversion.colors.applyGrayScale(scaled_pixel_grid);

      const gray_scale_color_converted = conversion.colors.convertPixelGridColorsForMC(
        gray_scale
      );

      const target_canvas = getCanvas(CANVAS.TARGET);
      const tctx = target_canvas.getContext('2d')!;

      const scaled_up_pixel_grid = conversion.scaleUpPixelGrid(
        color_converted,
        620,
        620
      );

      const target_image_data = conversion.convertPixelGridToImageData(
        scaled_up_pixel_grid
      );

      target_canvas.setAttribute('width', '1024');
      target_canvas.setAttribute('height', '1024');
      tctx.putImageData(target_image_data, 0, 0);
    };
    image.src = URL.createObjectURL(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragEnd={(e) => e.preventDefault()}
        style={{ background: 'red' }}
        onClick={openFileSelector}
      >
        hello
        <input
          type="file"
          id="file"
          style={{ visibility: 'hidden' }}
          onChange={handleFile}
        />
      </div>

      <canvas id={CANVAS.SOURCE} />
      <canvas id={CANVAS.TARGET} />
    </div>
  );
}
