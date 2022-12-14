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
  stroke-dasharray: 5px;
  stroke: ${(props) => props.theme['dark-red']};
  fill: rgba(0, 0, 0, 0.6);
  cursor: pointer;
`;

const ResizeHandle = styled.rect`
  fill: ${(props) => props.theme['dark-green']};
  stroke: ${(props) => props.theme['bg0-hard']};
  stroke-width: 2px;
  transform: translate(-20px, -20px);
  cursor: pointer;
`;

type OverlayProps = {
  scale: defs.Scale;
  bounds: defs.Bounds;
  onBoundsChange: (bounds: defs.Bounds) => void;
  canvas_dimensions: Coords;
  min_x: number;
  min_y: number;
};
export const SelectionOverlay: React.FC<OverlayProps> = (props) => {
  const [drag_event, setDragEvent] = React.useState<SelectionBoxOperation | null>();

  const [x, y, dx, dy] = props.bounds;
  const [handle_x, handle_y] = [x + dx, y + dy];

  const ratio_xy = props.scale.y / props.scale.x;
  const ratio_yx = props.scale.x / props.scale.y;

  const handleResizeDragEvent = (mouse_event: React.MouseEvent, op: SelectionBoxOperation) => {
    const [diff_x, diff_y] = calculateMouseDiff(op, mouse_event);
    const [init_x, init_y, init_dx, init_dy] = op.initial_bounds;

    let dx, dy;
    if (diff_y * -1 > diff_x * -1) {
      dx = init_dx - diff_y * ratio_yx;
      dy = init_dy - diff_y;
    } else {
      dx = init_dx - diff_x;
      dy = init_dy - diff_x * ratio_xy;
    }

    const [max_x, max_y] = props.canvas_dimensions;
    if (init_x + dx > max_x) {
      dx = max_x - init_x;
      dy = dx * ratio_xy;
    }
    if (init_y + dy > max_y) {
      dy = max_y - init_y;
      dx = dy * ratio_yx;
    }

    if (dx <= props.min_x) {
      dx = props.min_x;
      dy = dx * ratio_xy;
    }

    if (dy <= props.min_y) {
      dy = props.min_y;
      dx = dy * ratio_yx;
    }

    props.onBoundsChange([x, y, Math.floor(dx), Math.floor(dy)]);
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
    if (x + dx > max_x) {
      x = max_x - dx;
    }
    if (y + dy > max_y) {
      y = max_y - dy;
    }

    props.onBoundsChange([x, y, dx, dy]);
  };

  React.useEffect(() => {
    if (!drag_event) {
      return;
    }
    const mouseUpHandler = () => {
      setDragEvent(null);
    };
    document.addEventListener('mouseup', mouseUpHandler);
    return () => {
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [drag_event]);

  return (
    <SVGContainer
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
        width={dx}
        height={dy}
        onMouseDown={(e) => {
          setDragEvent({
            type: 'move',
            initial_bounds: props.bounds,
            mouse_coords: [e.pageX, e.pageY]
          });
        }}
      />

      <ResizeHandle
        x={handle_x}
        y={handle_y}
        width={12}
        height={12}
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
