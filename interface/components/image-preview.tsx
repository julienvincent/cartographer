import * as pixels from '@cartographer/pixels';
import styled from 'styled-components';
import * as defs from '../defs';
import * as React from 'react';

type Props = {
  image_data: ImageData;
  scale: defs.MAP_SCALE;
  className?: string;
  style?: React.CSSProperties;
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

    const preview_scale = 640;

    const pixel_grid = pixels.conversion.convertImageDataToPixelGrid(props.image_data);
    const scaled_pixel_grid = pixels.conversion.scaleDownPixelGrid(pixel_grid, props.scale, props.scale);
    const color_converted = pixels.conversion.convertPixelGridColorsForMC(scaled_pixel_grid);
    const scaled_up_pixel_grid = pixels.conversion.scaleUpPixelGrid(color_converted, preview_scale, preview_scale);
    const image_data = pixels.conversion.convertPixelGridToImageData(scaled_up_pixel_grid);

    const tmp_canvas = new OffscreenCanvas(image_data.width, image_data.height);
    const tmp_context = tmp_canvas.getContext('2d')!;
    tmp_context.putImageData(image_data, 0, 0);

    const context = canvas.current.getContext('2d')!;
    canvas.current.setAttribute('width', preview_scale.toString());
    canvas.current.setAttribute('height', preview_scale.toString());

    context.drawImage(tmp_canvas, 0, 0, preview_scale, preview_scale);
  }, [props.image_data, props.scale, canvas.current]);

  return (
    <Container className={props.className} style={props.style}>
      <canvas ref={canvas} />
    </Container>
  );
};
