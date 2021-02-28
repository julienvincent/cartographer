import * as palette_selector from './pallete-selector';
import * as api_worker from '../workers/api.worker';
import styled from 'styled-components';
import * as comlink from 'comlink';
import * as hooks from '../hooks';
import * as utils from '../utils';
import * as defs from '../defs';
import * as React from 'react';
import * as async from 'async';
import { Card } from './card';

type Props = {
  image_data: ImageData;
  scale: defs.MAP_SCALE;
  bounds: defs.Bounds;

  palette: defs.ColorPalette;

  className?: string;
  style?: React.CSSProperties;
};

const Container = styled(Card)`
  background-image: linear-gradient(to bottom right, rgb(114, 133, 222), rgb(128, 210, 171));
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Canvas = styled.canvas`
  border-radius: 10px;
`;

const createPreviewQueue = () => {
  return async.cargoQueue(async (tasks: Array<() => Promise<void>>, done) => {
    const last_task = tasks[tasks.length - 1];
    try {
      await last_task();
    } catch (err) {}
    done();
  });
};

export const ImagePreview: React.FC<Props> = (props) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const queue = React.useRef(createPreviewQueue());
  const api = hooks.withAPIWorker();

  React.useEffect(() => {
    if (!canvas.current || !api.current) {
      return;
    }

    queue.current.push(async () => {
      const image_data = await api.current!.generatePreview({
        image_data: props.image_data,
        bounds: props.bounds,
        map_scale: props.scale,
        palette: utils.normalizeColorPalette(props.palette)
      });

      canvas.current!.setAttribute('width', image_data.width.toString());
      canvas.current!.setAttribute('height', image_data.height.toString());
      canvas.current!.getContext('2d')!.putImageData(image_data, 0, 0);
    });
  }, [props.image_data, canvas.current, api.current, props.bounds, props.palette]);

  return (
    <Container
      className={props.className}
      style={{
        ...props.style,
        width: 640,
        height: 640
      }}
    >
      <Canvas ref={canvas} />
    </Container>
  );
};
