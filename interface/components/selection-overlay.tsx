import styled from 'styled-components';
import * as React from 'react';

const a = 1;
console.log(`asdasdasd ${a + 1} asdasd`);

type Coords = [x: number, y: number];
export type Bounds = [x: number, y: number, w: number, h: number];

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

const calculateMouseDiff = (drag_event: MoveDragEvent | ResizeDragEvent, mouse_event: React.MouseEvent) => {
  const [init_x, init_y] = drag_event.mouse_coords;

  const diff_x = init_x - mouse_event.pageX;
  const diff_y = init_y - mouse_event.pageY;

  return [diff_x, diff_y];
};

const SVGContainer = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  
  width: 512px
  
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

type OverlayProps = {
  bounds: Bounds;
  onBoundsChange: (bounds: Bounds) => void;
  canvas_dimensions: [number, number];
};
export const SelectionOverlay: React.FC<OverlayProps> = (props) => {
  const [drag_event, setDragEvent] = React.useState<ResizeDragEvent | MoveDragEvent | null>();

  const [x, y, w, h] = props.bounds;
  const [handle_x, handle_y] = [x + w, y + h];

  const handleResizeDragEvent = (mouse_event: React.MouseEvent, drag_event: ResizeDragEvent) => {
    const [diff_x, diff_y] = calculateMouseDiff(drag_event, mouse_event);
    const [init_w, init_h] = drag_event.selection_dimensions;

    let leader = diff_x;
    if (diff_y * -1 > diff_x * -1) {
      leader = diff_y;
    }

    const w = init_w - leader;
    const h = init_h - leader;

    props.onBoundsChange([x, y, w, h]);
  };

  const handleMoveDragEvent = (mouse_event: React.MouseEvent, drag_event: MoveDragEvent) => {
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

    const [max_x, max_y] = props.canvas_dimensions;
    if (x + w > max_x) {
      x = max_x - w;
    }
    if (y + h > max_y) {
      y = max_y - h;
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
