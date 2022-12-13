import styled from 'styled-components';
import * as React from 'react';

import Tooltip from './tooltip';
import Loader from './loader';

const Container = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  position: relative;

  font-weight: bold;
  cursor: pointer;
  user-select: none;
  color: ${(props) => props.theme.fg0};
  background-color: ${(props) => props.theme['bg0-soft']};
  transition: all 0.2s ease;

  ${(props) => (props.disabled ? 'pointer-events: none;' : '')}
`;

const Button = styled.div<{ disabled: boolean }>`
  padding: 5px 10px;

  :hover {
    opacity: 0.8;
  }

  ${(props) => (props.disabled ? 'opacity: 0.2;' : '')};
`;

const Selector = styled.div<{ disabled: boolean }>`
  margin-left: 10px;
  border-left: 1px dashed ${(props) => props.theme.fg4};
  padding: 5px 10px;

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

type Action = {
  name: string;
  fn: () => void;
};

type Props = {
  style?: React.CSSProperties;
  className?: string;

  tooltip?: string | string[];

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

  React.useEffect(() => {
    const handler = () => {
      setPickerShowing(false);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  return (
    <Tooltip tooltip={props.tooltip}>
      <Container disabled={disabled} className={props.className} style={props.style}>
        <Button
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
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
        ) : props.actions.length > 1 ? (
          <Selector
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              setPickerShowing(!picker_showing);
            }}
          >
            {' '}
            <p>▼</p>
          </Selector>
        ) : null}

        {picker_showing && (
          <Picker>
            {props.actions.map((action) => {
              return (
                <ActionItem
                  key={action.name}
                  onClick={(e) => {
                    e.stopPropagation();
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
    </Tooltip>
  );
};

export default MultiButton;
