import styled from 'styled-components';
import ReactSlider from 'react-slider';
import * as React from 'react';
import * as _ from 'lodash';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-grow: 1;
  height: 25px;
`;

const StyledSlider = styled(ReactSlider)`
  flex-grow: 1;
`;

const Track = styled.div`
  border-top: 2px dashed ${(props) => props.theme['dark-green']};
  height: 10px;
  top: 25%;

  left: 0;
  right: 0;
  position: absolute;
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 15px;
  width: 40px;
  text-align: center;
  background-color: ${(props) => props.theme['bg0-hard']};
  border: 2px dashed ${(props) => props.theme['dark-yellow']};
  color: ${(props) => props.theme['fg0']};
  font-size: 12px;
  font-weight: bold;
  cursor: grab;

  :focus {
    outline: none !important;
  }
`;

const Label = styled.p`
  color: ${(props) => props.theme.fg2};
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;

  label: string;

  value: number;
  onChange: (value: number) => void;
};

export const Slider: React.FC<Props> = (props) => {
  return (
    <Container style={props.style} className={props.className}>
      <Label>{props.label}</Label>

      <SliderContainer>
        <StyledSlider
          min={-100}
          max={100}
          value={props.value}
          onChange={(value) => {
            props.onChange(value as number);
          }}
          renderTrack={({ style, ...props }) => {
            return <Track {...(props as any)} />;
          }}
          renderThumb={(props, state) => {
            return <Handle {...(props as any)}>{state.valueNow}</Handle>;
          }}
        />
      </SliderContainer>
    </Container>
  );
};

export default Slider;
