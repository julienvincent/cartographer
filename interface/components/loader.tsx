import { keyframes } from 'styled-components';
import styled from 'styled-components';
import * as React from 'react';

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

const LoaderContainer = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => props.theme['light-orange']};
  margin-left: 8px;

  animation: ${scale} 2s ease-in-out infinite;
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;
};

export const Loader: React.FC<Props> = (props) => {
  return <LoaderContainer style={props.style} className={props.className} />;
};

export default Loader;
