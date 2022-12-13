import styled from 'styled-components';
import * as React from 'react';
import * as _ from 'lodash';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
`;

const TooltipContainer = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 5px;
  z-index: 100;

  background-color: ${(props) => props.theme['bg0-hard']};
  border: 2px dashed ${(props) => props.theme.fg3};
  padding: 5px 10px;
`;

const Text = styled.p`
  color: ${(props) => props.theme.fg0};
  font-size: 12px;
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;

  children: React.ReactNode;

  tooltip?: string | string[];
};

export const Tooltip: React.FC<Props> = (props) => {
  const [visible, setVisible] = React.useState(false);

  if (!props.tooltip) {
    return <>{props.children}</>;
  }

  return (
    <Container
      style={props.style}
      className={props.className}
      onMouseEnter={() => {
        setVisible(true);
      }}
      onMouseLeave={() => {
        setVisible(false);
      }}
    >
      {props.children}

      {visible && (
        <TooltipContainer>
          {Array.isArray(props.tooltip) ? (
            props.tooltip.map((text, i) => {
              return (
                <>
                  <Text key={i}>{text}</Text>
                  {i !== props.tooltip!.length - 1 ? <br key={`${i}-br`} /> : null}
                </>
              );
            })
          ) : (
            <Text>{props.tooltip}</Text>
          )}
        </TooltipContainer>
      )}
    </Container>
  );
};

export default Tooltip;
