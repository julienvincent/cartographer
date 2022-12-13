import { keyframes } from 'styled-components';
import styled from 'styled-components';
import * as React from 'react';

const Container = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  position: relative;

  padding: 5px 10px;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
  color: ${(props) => props.theme.fg0};
  background-color: ${(props) => props.theme['bg0-soft']};
  transition: all 0.2s ease;

  ${(props) => (props.disabled ? 'pointer-events: none;' : '')}
`;

const Button = styled.div<{ disabled: boolean }>`
  :hover {
    opacity: 0.8;
  }

  ${(props) => (props.disabled ? 'opacity: 0.2;' : '')};
`;

const Selector = styled.div<{ disabled: boolean }>`
  margin-left: 10px;
  border-left: 1px dashed ${(props) => props.theme.fg4};
  padding-left: 10px;

  :hover {
    opacity: 0.8;
  }

  ${(props) => (props.disabled ? 'opacity: 0.2;' : '')};
`;

const Picker = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  min-width: 100%;
  z-index: 100;

  border: 2px dashed ${(props) => props.theme['dark-green']};
  background-color: ${(props) => props.theme['bg0-hard']};
`;

const ActionItem = styled.div`
  padding: 5px 10px;
  color: ${(props) => props.theme['fg2']};
  border: 1px dashed ${(props) => props.theme['bg0-hard']};
  white-space: nowrap;

  :hover {
    border: 1px dashed ${(props) => props.theme.fg2};
  }
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
  background: ${(props) => props.theme['light-orange']};
  margin-left: 8px;

  animation: ${scale} 2s ease-in-out infinite;
`;

type Action = {
  name: string;
  fn: () => void;
};

type Props = {
  style?: React.CSSProperties;
  className?: string;

  prefix?: string;

  actions: Action[];
  onSelectionChange?: (action: Action) => void;
  selection?: Action;

  action_opens_picker?: boolean;

  disabled?: boolean;
  loading?: boolean;
};

export const MultiButton: React.FC<Props> = (props) => {
  const [picker_showing, setPickerShowing] = React.useState(false);
  const [_action, setAction] = React.useState(props.actions[0]);

  const action = props.selection || _action;
  const disabled = props.disabled || props.loading || false;

  return (
    <Container disabled={disabled} className={props.className} style={props.style}>
      <Button
        disabled={disabled}
        onClick={() => {
          if (props.action_opens_picker) {
            setPickerShowing(!picker_showing);
          } else {
            action.fn();
          }
        }}
      >
        {props.prefix}
        {props.prefix ? ' ' : ''}
        {action.name}
      </Button>

      {props.loading ? (
        <Loader />
      ) : (
        <Selector disabled={disabled} onClick={() => setPickerShowing(!picker_showing)}>
          {' '}
          <p>▼</p>
        </Selector>
      )}

      {picker_showing && (
        <Picker>
          {props.actions.map((action) => {
            return (
              <ActionItem
                key={action.name}
                onClick={() => {
                  props.onSelectionChange?.(action);
                  setAction(action);
                  setPickerShowing(false);
                }}
              >
                {action.name}
              </ActionItem>
            );
          })}
        </Picker>
      )}
    </Container>
  );
};

export default MultiButton;
