import * as pixels from '@cartographer/pixels';
import styled from 'styled-components';
import * as React from 'react';

export enum MAP_SCALE {
  X1 = 128
}

type Props = {
  image_data: ImageData;
  scale: MAP_SCALE;
};

const Container = styled.div`
  display: flex;
`;

export const ImagePreview: React.FC<Props> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    console.log('painting');
    if (!canvas.current) {
      console.log('not painting');
      return;
    }

    const pixel_grid = pixels.conversion.convertImageDataToPixelGrid(props.image_data);

    const scaled_pixel_grid = pixels.conversion.scaleDownPixelGrid(pixel_grid, props.scale, props.scale);

    const color_converted = pixels.conversion.convertPixelGridColorsForMC(scaled_pixel_grid);

    const scaled_up_pixel_grid = pixels.conversion.scaleUpPixelGrid(color_converted, props.scale * 5, props.scale * 5);

    const image_data = pixels.conversion.convertPixelGridToImageData(scaled_up_pixel_grid);

    const context = canvas.current.getContext('2d')!;
    canvas.current.setAttribute('width', image_data.width.toString());
    canvas.current.setAttribute('height', image_data.height.toString());
    context.putImageData(image_data, 0, 0);
  }, [props.image_data, props.scale, canvas.current]);

  return (
    <Container>
      <canvas ref={canvas} />
    </Container>
  );
};
