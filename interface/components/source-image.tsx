import * as overlay from './selection-overlay';
import styled from 'styled-components';
import * as React from 'react';
import * as _ from 'lodash';

const Container = styled.div`
  position: relative;
  display: flex;
`;

type Props = {
  file: File;
  onImageDataChange: (image_data: ImageData) => void;
};

export const SourceImage: React.FC<Props> = (props) => {
  const [canvas_dimensions, setCanvasDimensions] = React.useState<[number, number]>([0, 0]);
  const [bounds, setBounds] = React.useState<overlay.Bounds>();
  const canvas = React.useRef<HTMLCanvasElement>(null);

  const read = React.useRef(
    _.debounce(
      (bounds: overlay.Bounds) => {
        const context = canvas.current!.getContext('2d')!;
        const [x, y, d] = bounds;
        props.onImageDataChange(context.getImageData(x, y, d, d));
      },
      250,
      { maxWait: 500 }
    )
  );

  const updateBoundsAndRead = (bounds: overlay.Bounds) => {
    setBounds(bounds);
    read.current(bounds);
  };

  React.useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const context = canvas.current.getContext('2d')!;
    const image = new Image();

    image.onload = () => {
      const scale = image.naturalWidth / image.naturalHeight;
      const width = 512;
      const height = Math.floor(width / scale);

      canvas.current!.setAttribute('width', width.toString());
      canvas.current!.setAttribute('height', height.toString());

      context.drawImage(image, 0, 0, width, height);
      setCanvasDimensions([width, height]);

      const dimension = Math.min(width, height);
      updateBoundsAndRead([0, 0, dimension]);
    };

    image.src = URL.createObjectURL(props.file);
  }, [props.file]);

  const [width, height] = canvas_dimensions;

  return (
    <Container>
      <canvas ref={canvas} style={{ width, height }} />

      {bounds ? (
        <overlay.SelectionOverlay
          bounds={bounds}
          onBoundsChange={updateBoundsAndRead}
          canvas_dimensions={canvas_dimensions}
        />
      ) : null}
    </Container>
  );
};
