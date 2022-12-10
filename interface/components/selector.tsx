import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Button } from './button';
import * as React from 'react';
import { Card } from './card';

const Container = styled.div<{ disabled?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.light_grey};
  margin-left: 8px;
  font-size: 14px;
`;

const DropDownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 5px;

  border-radius: 10px;
  box-shadow: 0 5px 20px 5px rgba(135, 135, 135, 0.3);
`;

const DropDownOption = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 1;
  color: black;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  padding: 0 5px;
  margin: 2px;

  :hover {
    background: rgba(20, 20, 20, 0.1);
    border-radius: 5px;
  }
`;

const SelectedIndicator = styled.div<{ selected: boolean }>`
  background: rgba(71, 94, 218, 1);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  opacity: ${(props) => (props.selected ? '1' : '0')};
`;

type Props = {
  style?: React.CSSProperties;
  className?: string;

  disabled?: boolean;
  loading?: boolean;

  options: (string | number)[];
  selected: string | number;
  label: string;

  onSelect: (option: string | number) => void;
};

export const Selector: React.FC<Props> = (props) => {
  const [open, isOpen] = React.useState(false);
  const handler = React.useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isOpen(false);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.addEventListener('click', handler);
    }
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [open]);

  return (
    <Container
      disabled={props.disabled}
      className={props.className}
      style={props.style}
      onClick={() => {
        isOpen(true);
      }}
    >
      <Button>
        {props.label}
        <Icon icon={icons.faChevronCircleDown} />
      </Button>

      {open ? (
        <DropDownContainer
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {props.options.map((option, i) => {
            return (
              <DropDownOption key={i} onClick={() => props.onSelect(option)}>
                <SelectedIndicator selected={option === props.selected} />
                {option}
              </DropDownOption>
            );
          })}
        </DropDownContainer>
      ) : null}
    </Container>
  );
};
