import styled from 'styled-components';
import * as defs from '../defs';
import * as React from 'react';

type Coords = [x: number, y: number];

type SelectionBoxOperation = {
  type: 'resize' | 'move';
  initial_bounds: defs.Bounds;
  mouse_coords: Coords;
};

const calculateMouseDiff = (op: SelectionBoxOperation, mouse_event: React.MouseEvent) => {
  const [init_x, init_y] = op.mouse_coords;

  const diff_x = init_x - mouse_event.pageX;
  const diff_y = init_y - mouse_event.pageY;

  return [diff_x, diff_y];
};

const SVGContainer = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const SelectionBox = styled.rect`
  stroke-width: 2px;
  stroke: ${(props) => props.theme.red};
  fill: rgba(255, 255, 255, 0.4);
  cursor: pointer;
`;

const ResizeHandle = styled.circle`
  fill: white;
  transform: translate(-15px, -15px);
  cursor: pointer;
`;

type OverlayProps = {
  bounds: defs.Bounds;
  onBoundsChange: (bounds: defs.Bounds) => void;
  canvas_dimensions: Coords;
  min: number;
};
export const SelectionOverlay: React.FC<OverlayProps> = (props) => {
  const [drag_event, setDragEvent] = React.useState<SelectionBoxOperation | null>();

  const [x, y, d] = props.bounds;
  const [handle_x, handle_y] = [x + d, y + d];

  const handleResizeDragEvent = (mouse_event: React.MouseEvent, op: SelectionBoxOperation) => {
    const [diff_x, diff_y] = calculateMouseDiff(op, mouse_event);
    const [init_x, init_y, init_d] = op.initial_bounds;

    let leader = diff_x;
    if (diff_y * -1 > diff_x * -1) {
      leader = diff_y;
    }

    let d = init_d - leader;

    const [max_x, max_y] = props.canvas_dimensions;
    if (init_x + d > max_x) {
      d = max_x - init_x;
    }
    if (init_y + d > max_y) {
      d = max_y - init_y;
    }

    if (d <= props.min) {
      d = props.min;
    }

    props.onBoundsChange([x, y, d]);
  };

  const handleMoveDragEvent = (mouse_event: React.MouseEvent, op: SelectionBoxOperation) => {
    const [diff_x, diff_y] = calculateMouseDiff(op, mouse_event);
    const [init_x, init_y] = op.initial_bounds;

    let x = init_x - diff_x;
    let y = init_y - diff_y;

    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }

    const [max_x, max_y] = props.canvas_dimensions;
    if (x + d > max_x) {
      x = max_x - d;
    }
    if (y + d > max_y) {
      y = max_y - d;
    }

    props.onBoundsChange([x, y, d]);
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
        rx={10}
        width={d}
        height={d}
        onMouseDown={(e) => {
          setDragEvent({
            type: 'move',
            initial_bounds: props.bounds,
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
            initial_bounds: props.bounds,
            mouse_coords: [e.pageX, e.pageY]
          });
        }}
      />
    </SVGContainer>
  );
};
