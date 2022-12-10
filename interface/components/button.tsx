import { keyframes } from 'styled-components';
import styled from 'styled-components';
import * as React from 'react';

const Container = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  background-image: linear-gradient(to bottom right, rgb(135, 149, 233), rgba(71, 94, 218, 1));
  border-radius: 5px;
  box-shadow: 0 5px 15px 1px rgba(135, 135, 135, 0.3);
  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  color: ${(props) => props.theme['light-gray']};
  transition: all 0.2s ease;

  :hover {
    box-shadow: 0 5px 12px 1px rgba(135, 135, 135, 0.5);
  }

  ${(props) => (props.disabled ? 'opacity: 0.2;' : '')};
  ${(props) => (props.disabled ? 'pointer-events: none;' : '')}
`;

const scale = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
`;

const Loader = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => props.theme.bg0};
  box-shadow: 0 0 12px 1px rgba(135, 135, 135, 1);
  margin-left: 8px;

  animation: ${scale} 2s ease-in-out infinite;
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;

  onClick?: (e: React.MouseEvent) => void;

  disabled?: boolean;
  loading?: boolean;
};

export const Button: React.FC<Props> = (props) => {
  return (
    <Container disabled={props.disabled} className={props.className} style={props.style} onClick={props.onClick}>
      {props.children}

      {props.loading ? <Loader /> : null}
    </Container>
  );
};
