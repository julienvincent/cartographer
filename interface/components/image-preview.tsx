import styled from 'styled-components';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';

type Props = {
  image_data: ImageData;
  scale: defs.MAP_SCALE;
  bounds: defs.Bounds;
  className?: string;
  style?: React.CSSProperties;
};

const Container = styled.div`
  display: flex;
`;

export const ImagePreview: React.FC<Props> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const api = hooks.withAPIWorker();

  React.useEffect(() => {
    (async () => {
      if (!canvas.current || !api.current) {
        return;
      }

      const image_data = await api.current.generatePreview({
        image_data: props.image_data,
        bounds: props.bounds,
        map_scale: props.scale
      });

      canvas.current.setAttribute('width', image_data.width.toString());
      canvas.current.setAttribute('height', image_data.height.toString());
      canvas.current.getContext('2d')!.putImageData(image_data, 0, 0);
    })();
  }, [props.image_data, canvas.current, api.current, props.bounds]);

  return (
    <Container className={props.className} style={props.style}>
      <canvas ref={canvas} />
    </Container>
  );
};
