import * as overlay from './selection-overlay';
import styled from 'styled-components';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import * as _ from 'lodash';

const Container = styled.div`
  position: relative;
  display: flex;
`;

type Props = {
  image_data: ImageData;
  scale: defs.MAP_SCALE;
  onBoundsChange: (bounds: defs.Bounds, raw_bounds: defs.Bounds) => void;
};

export const SourceImage: React.FC<Props> = (props) => {
  const [canvas_dimensions, setCanvasDimensions] = React.useState<[number, number]>([0, 0]);
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const api = hooks.withAPIWorker();

  const scale_factor = props.image_data.width / 512;
  const min = Math.ceil(props.scale / scale_factor);

  const scaleAndNotify = (bounds: defs.Bounds) => {
    const scaled_bounds = bounds.map((item) => Math.floor(item * scale_factor)) as defs.Bounds;
    props.onBoundsChange(scaled_bounds, bounds);
  };

  const scaleAndNotifyDebounced = React.useCallback(_.debounce(scaleAndNotify, 100, { maxWait: 200 }), [
    props.image_data
  ]);

  const updateBounds = (bounds: defs.Bounds) => {
    setBounds(bounds);
    scaleAndNotifyDebounced(bounds);
  };

  React.useEffect(() => {
    (async () => {
      if (!canvas.current || !api.current) {
        return;
      }

      const width = 512;
      const height = Math.floor(props.image_data.height / scale_factor);

      const scale_canvas = new OffscreenCanvas(props.image_data.width, props.image_data.height);
      const scale_context = scale_canvas.getContext('2d')!;

      scale_context.putImageData(props.image_data, 0, 0);

      canvas.current.setAttribute('width', width.toString());
      canvas.current.setAttribute('height', height.toString());

      const context = canvas.current.getContext('2d')!;
      context.drawImage(scale_canvas, 0, 0, width, height);
      setCanvasDimensions([width, height]);

      const dimension = Math.min(width, height);
      updateBounds([0, 0, dimension]);
    })();
  }, [props.image_data, api.current]);

  React.useEffect(() => {
    if (bounds) {
      const [, , d] = bounds;
      if (d < min) {
        const next_bounds: defs.Bounds = [0, 0, min];
        setBounds(next_bounds);
        scaleAndNotify(next_bounds);
      }
    }
  }, [min]);

  const [width, height] = canvas_dimensions;

  return (
    <Container>
      <canvas ref={canvas} style={{ width, height }} />

      {bounds ? (
        <overlay.SelectionOverlay
          bounds={bounds}
          min={min}
          onBoundsChange={updateBounds}
          canvas_dimensions={canvas_dimensions}
        />
      ) : null}
    </Container>
  );
};
