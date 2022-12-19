import { Transformations } from '../workers/api.worker';
import * as overlay from './selection-overlay';
import * as constants from '../constants';
import styled from 'styled-components';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import Slider from './slider';
import * as _ from 'lodash';

import CheckBox from './check-box';

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

const Options = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

type Props = {
  image_data: ImageData;
  scale: defs.Scale;
  onBoundsChange: (bounds: defs.Bounds, raw_bounds: defs.Bounds) => void;

  transformations: Transformations;
  setTransformations: (transformations: Transformations) => void;
};

export const SourceImage: React.FC<Props> = (props) => {
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const api = hooks.withAPIWorker();

  const ratio_xy = props.image_data.height / props.image_data.width;
  const ratio_yx = props.image_data.width / props.image_data.height;

  let width: number, height: number, scale_factor: number;
  if (props.image_data.height > props.image_data.width) {
    height = constants.RENDER_IMAGE_MAX_SIZE;
    width = height * ratio_yx;
    scale_factor = props.image_data.height / height;
  } else {
    width = constants.RENDER_IMAGE_MAX_SIZE;
    height = width * ratio_xy;
    scale_factor = props.image_data.width / width;
  }

  const min_x = Math.ceil((props.scale.x * constants.SCALE_FACTOR) / scale_factor);
  const min_y = Math.ceil((props.scale.y * constants.SCALE_FACTOR) / scale_factor);

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

      const scale_canvas = new OffscreenCanvas(props.image_data.width, props.image_data.height);
      const scale_context = scale_canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

      scale_context.putImageData(props.image_data, 0, 0);

      canvas.current.setAttribute('width', width.toString());
      canvas.current.setAttribute('height', height.toString());

      const context = canvas.current.getContext('2d')!;
      context.drawImage(scale_canvas, 0, 0, width, height);
    })();
  }, [props.image_data, api.current]);

  React.useEffect(() => {
    const bounds: defs.Bounds = [0, 0, min_x, min_y];
    setBounds(bounds);
    scaleAndNotify(bounds);
  }, [min_x, min_y]);

  return (
    <Container>
      <CanvasContainer>
        <Canvas ref={canvas} style={{ width, height }} />

        {bounds ? (
          <overlay.SelectionOverlay
            bounds={bounds}
            scale={props.scale}
            min_x={min_x}
            min_y={min_y}
            onBoundsChange={updateBounds}
            canvas_dimensions={[width, height]}
          />
        ) : null}
      </CanvasContainer>

      <Options>
        <Slider
          label="Saturation"
          style={{ marginTop: 10, marginRight: 15 }}
          value={props.transformations.saturation || 0}
          onChange={(value) => {
            props.setTransformations({
              ...props.transformations,
              saturation: value
            });
          }}
        />

        <Slider
          label="Brightness"
          style={{ marginTop: 10 }}
          value={props.transformations.brightness || 0}
          onChange={(value) => {
            props.setTransformations({
              ...props.transformations,
              brightness: value
            });
          }}
        />
      </Options>

      <Options>
        <div>
          <CheckBox
            label="Enable dithering"
            label_side="left"
            tooltip={[
              "Enabling dithering will introduce some intentional noise to the image with the aim of keeping as much of the original images' color as possible.",
              'This has varying levels of success depending on the input image and scaling/zooming applied. It is recommended to play with the image saturation when enabling this.',
              'Your milage may vary.'
            ]}
            value={!!props.transformations.dither}
            onChange={(value) => {
              props.setTransformations({
                ...props.transformations,
                dither: value
              });
            }}
          />
        </div>
      </Options>
    </Container>
  );
};

export default SourceImage;
