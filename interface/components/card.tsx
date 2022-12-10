import styled from 'styled-components';
import * as React from 'react';

const Container = styled.div`
  display: flex;
  border-radius: 20px;
  box-shadow: 0 15px 30px 5px rgba(135, 135, 135, 0.3);
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
};

export const Card: React.FC<Props> = (props) => {
  return (
    <Container className={props.className} style={props.style} onClick={props.onClick}>
      {props.children}
    </Container>
  );
};
