import * as overlay from './selection-overlay';
import styled from 'styled-components';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import * as _ from 'lodash';
import Slider from './slider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`;

const CanvasContainer = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  padding: 10px;
  border: 2px dashed ${(props) => props.theme.bg4};
`;

const Canvas = styled.canvas`
  border: 1px solid ${(props) => props.theme.bg2};
`;

type Props = {
  image_data: ImageData;
  scale: defs.MAP_SCALE;
  onBoundsChange: (bounds: defs.Bounds, raw_bounds: defs.Bounds) => void;

  saturation: number;
  onSaturationChange: (contrast: number) => void;

  brightness: number;
  onBrightnessChange: (brightness: number) => void;
};

export const SourceImage: React.FC<Props> = (props) => {
  const [canvas_dimensions, setCanvasDimensions] = React.useState<[number, number]>([0, 0]);
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const api = hooks.withAPIWorker();

  const scale_factor = props.image_data.width / 640;
  const min = Math.ceil(props.scale / scale_factor);

  const scaleAndNotify = (bounds: defs.Bounds) => {
    const scaled_bounds = bounds.map((item) => Math.floor(item * scale_factor)) as defs.Bounds;
    props.onBoundsChange(scaled_bounds, bounds);
  };

  const scaleAndNotifyDebounced = React.useCallback(_.debounce(scaleAndNotify, 100, { maxWait: 200 }), [
    props.image_data,
    props.scale
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

      const width = 640;
      const height = Math.floor(props.image_data.height / scale_factor);

      const scale_canvas = new OffscreenCanvas(props.image_data.width, props.image_data.height);
      const scale_context = scale_canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

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
      <CanvasContainer>
        <Canvas ref={canvas} style={{ width, height }} />

        {bounds ? (
          <overlay.SelectionOverlay
            bounds={bounds}
            min={min}
            onBoundsChange={updateBounds}
            canvas_dimensions={canvas_dimensions}
          />
        ) : null}
      </CanvasContainer>

      <Slider
        label="Saturation"
        style={{ marginTop: 10 }}
        value={props.saturation}
        onChange={(value) => {
          props.onSaturationChange(value);
        }}
      />

      <Slider
        label="Brightness"
        style={{ marginTop: 10 }}
        value={props.brightness}
        onChange={(value) => {
          props.onBrightnessChange(value);
        }}
      />
    </Container>
  );
};

export default SourceImage;
