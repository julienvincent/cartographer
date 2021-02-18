import styled from 'styled-components';
import * as React from 'react';
import * as uuid from 'uuid';

const Container = styled.div`
  position: relative;
  display: flex;
`;

const SVGContainer = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  width: 512px;
`;

const SelectionBox = styled.rect`
  stroke-width: 1px;
  stroke: ${(props) => props.theme.light_blue};
  fill: rgba(0, 0, 0, 0);
  cursor: pointer;
`;

const ResizeHandle = styled.circle`
  fill: ${(props) => props.theme.light_blue};
  cursor: pointer;
`;

type Coords = [x: number, y: number];
type Bounds = [x: number, y: number, w: number, h: number];

type ResizeDragEvent = {
  type: 'resize';
  selection_dimensions: [w: number, h: number];
  mouse_coords: Coords;
};

type MoveDragEvent = {
  type: 'move';
  selection_coords: Coords;
  mouse_coords: Coords;
};

const calculateMouseDiff = (
  drag_event: MoveDragEvent | ResizeDragEvent,
  mouse_event: React.MouseEvent
) => {
  const [init_x, init_y] = drag_event.mouse_coords;

  const diff_x = init_x - mouse_event.pageX;
  const diff_y = init_y - mouse_event.pageY;

  return [diff_x, diff_y];
};

type Props = {
  file: File;
};

type OverlayProps = {
  bounds: Bounds;
  onBoundsChange: (bounds: Bounds) => void;
};
export const SelectionOverlay: React.FC<OverlayProps> = (props) => {
  const [drag_event, setDragEvent] = React.useState<
    ResizeDragEvent | MoveDragEvent | null
  >();

  const [x, y, w, h] = props.bounds;
  const [handle_x, handle_y] = [x + w, y + h];

  const handleResizeDragEvent = (
    mouse_event: React.MouseEvent,
    drag_event: ResizeDragEvent
  ) => {
    const [diff_x, diff_y] = calculateMouseDiff(drag_event, mouse_event);
    const [init_w, init_h] = drag_event.selection_dimensions;

    const w = init_w - diff_x;
    const h = init_h - diff_y;

    props.onBoundsChange([x, y, w, h]);
  };

  const handleMoveDragEvent = (
    mouse_event: React.MouseEvent,
    drag_event: MoveDragEvent
  ) => {
    const [diff_x, diff_y] = calculateMouseDiff(drag_event, mouse_event);
    const [init_x, init_y] = drag_event.selection_coords;

    let x = init_x - diff_x;
    let y = init_y - diff_y;

    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }

    props.onBoundsChange([x, y, w, h]);
  };

  return (
    <SVGContainer
      onMouseUp={() => {
        setDragEvent(null);
      }}
      onMouseMove={(e) => {
        if (!drag_event) {
          return;
        }

        switch (drag_event.type) {
          case 'resize': {
            return handleResizeDragEvent(e, drag_event);
          }
          case 'move': {
            return handleMoveDragEvent(e, drag_event);
          }
        }
      }}
    >
      <SelectionBox
        x={x}
        y={y}
        width={w}
        height={h}
        onMouseDown={(e) => {
          setDragEvent({
            type: 'move',
            selection_coords: [x, y],
            mouse_coords: [e.pageX, e.pageY]
          });
        }}
      />

      <ResizeHandle
        cx={handle_x}
        cy={handle_y}
        r={5}
        onMouseDown={(e) => {
          e.stopPropagation();
          setDragEvent({
            type: 'resize',
            selection_dimensions: [w, h],
            mouse_coords: [e.pageX, e.pageY]
          });
        }}
      />
    </SVGContainer>
  );
};

export const SourceImage: React.FC<Props> = (props) => {
  const [bounds, setBounds] = React.useState<Bounds>();
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvas.current) {
      return;
    }

    const context = canvas.current.getContext('2d')!;
    const image = new Image();

    image.onload = () => {
      const scale = image.naturalWidth / image.naturalHeight;
      const width = 512;
      const height = width / scale;

      canvas.current!.setAttribute('width', width.toString());
      canvas.current!.setAttribute('height', width.toString());

      context.drawImage(image, 0, 0, width, height);

      if (width >= height) {
        setBounds([0, 0, width, width]);
      } else {
        setBounds([0, 0, height, height]);
      }
    };

    image.src = URL.createObjectURL(props.file);
  }, [props.file]);

  return (
    <Container>
      <canvas ref={canvas} />

      {bounds ? (
        <SelectionOverlay bounds={bounds} onBoundsChange={setBounds} />
      ) : null}
    </Container>
  );
};
