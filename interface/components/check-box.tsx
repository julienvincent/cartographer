import styled from 'styled-components';
import * as React from 'react';
import * as _ from 'lodash';

import Tooltip from './tooltip';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
`;

const Box = styled.div<{ selected: boolean }>`
  width: 15px;
  height: 15px;
  border: 2px dashed ${(props) => props.theme.fg1};
  background-color: ${(props) => (props.selected ? props.theme['dark-orange'] : 'none')};
`;

const Label = styled.p`
  color: ${(props) => props.theme.fg2};
  margin-left: 10px;
  margin-right: 10px;
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;

  label: string;
  label_side: 'left' | 'right';

  tooltip?: string | string[];

  value: boolean;
  onChange: (value: boolean) => void;
};

export const CheckBox: React.FC<Props> = (props) => {
  return (
    <Tooltip tooltip={props.tooltip}>
      <Container
        style={props.style}
        className={props.className}
        onClick={() => {
          props.onChange(!props.value);
        }}
      >
        {props.label_side === 'left' && <Label>{props.label}</Label>}

        <Box selected={props.value} />

        {props.label_side === 'right' && <Label>{props.label}</Label>}
      </Container>
    </Tooltip>
  );
};

export default CheckBox;
