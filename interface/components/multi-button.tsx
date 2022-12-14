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
  padding: 5px 10px;

  :hover {
    opacity: 0.8;
  }

  ${(props) => (props.disabled ? 'opacity: 0.2;' : '')};
`;

const Separator = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
  border-left: 1px dashed ${(props) => props.theme.fg4};
  align-self: stretch;
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
  fn?: () => void;
};

type Props = {
  style?: React.CSSProperties;
  className?: string;

  tooltip?: string | string[];

  prefix?: string;

  actions: Action[];
  onSelectionChange?: (name: string) => void;
  selected?: string;

  action_opens_picker?: boolean;

  disabled?: boolean;
  loading?: boolean;
};

export const MultiButton: React.FC<Props> = (props) => {
  const [picker_showing, setPickerShowing] = React.useState(false);
  const [_selected, setSelected] = React.useState(props.actions[0].name);

  const action = props.actions.find((action) => action.name === (props.selected ?? _selected));
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
      <Container
        disabled={disabled}
        className={props.className}
        style={props.style}
        onClick={(e) => {
          // This prevents any click that occurred on the button element from triggering the global 'click off'
          // handler registered in the components effect.
          e.stopPropagation();
        }}
      >
        <Button
          disabled={disabled}
          onClick={() => {
            if (props.action_opens_picker) {
              setPickerShowing(!picker_showing);
            } else {
              action?.fn?.();
            }
          }}
        >
          {props.prefix}
          {props.prefix ? ' ' : ''}
          {action?.name}
        </Button>

        {props.loading ? (
          <Loader />
        ) : props.actions.length > 1 ? (
          <>
            <Separator />
            <Selector
              disabled={disabled}
              onClick={() => {
                setPickerShowing(!picker_showing);
              }}
            >
              {' '}
              <p>▼</p>
            </Selector>
          </>
        ) : null}

        {picker_showing && (
          <Picker>
            {props.actions.map((action) => {
              return (
                <ActionItem
                  key={action.name}
                  onClick={() => {
                    props.onSelectionChange?.(action.name);
                    setSelected(action.name);
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
