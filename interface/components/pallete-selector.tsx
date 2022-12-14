import * as pixels from '@cartographer/pixels';
import styled from 'styled-components';
import * as defs from '../defs';
import * as React from 'react';

type MultiColorIconProps = {
  colors: pixels.Pixel[];
  style?: React.CSSProperties;
  enabled: boolean;
};

const MultiColorContainer = styled.div<{ enabled: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  justify-items: stretch;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  opacity: ${(props) => (props.enabled ? '1' : '.4')};
`;

const MultiColorSlice = styled.div<{ c: string }>`
  background: ${(props) => props.c};
  display: flex;
  flex-grow: 1;
`;

export const MultiColorIcon: React.FC<MultiColorIconProps> = (props) => {
  return (
    <MultiColorContainer style={props.style} enabled={props.enabled}>
      {props.colors.map(({ r, g, b }, i) => {
        return <MultiColorSlice key={i} c={`rgb(${r}, ${g}, ${b})`} />;
      })}
    </MultiColorContainer>
  );
};

const EnabledSelectorContainer = styled.div<{ enabled: boolean | -1 }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  margin-left: auto;
  cursor: pointer;
  color: ${(props) => {
    if (props.enabled === -1) {
      return props.theme['dark-yellow'];
    }
    return !props.enabled ? props.theme['dark-green'] : props.theme['dark-red'];
  }};
  user-select: none;
`;

type EnabledSelectorProps = {
  enabled: boolean | -1;
  onChange: (enabled: boolean) => void;
};
export const EnabledSelector: React.FC<EnabledSelectorProps> = (props) => {
  let char = '';
  if (props.enabled === -1) {
    char = '~';
  } else if (props.enabled) {
    char = '-';
  } else {
    char = '+';
  }

  return (
    <EnabledSelectorContainer
      enabled={props.enabled}
      onClick={() => {
        if (!props.enabled || props.enabled === -1) {
          props.onChange(true);
        } else {
          props.onChange(false);
        }
      }}
    >
      <p style={{ fontWeight: 'bold' }}>[{char}]</p>
    </EnabledSelectorContainer>
  );
};

namespace BlockSelector {
  const Container = styled.div<{ enabled: boolean }>`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    opacity: ${(props) => (props.enabled ? '1' : '.4')};
  `;

  const BlockContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    cursor: pointer;
  `;

  const Text = styled.p<{ selected: boolean }>`
    color: ${(props) => (props.selected ? props.theme['light-green'] : props.theme['light-gray'])};
    font-weight: ${(props) => (props.selected ? 'bold' : 'medium')};
    text-decoration: ${(props) => (props.selected ? 'underline dashed' : '')};
    user-select: none;
  `;

  type BlockSelectorProps = {
    block_ids: string[];
    selected: string[];
    onChange: (block_ids: string[]) => void;
    enabled: boolean;
  };
  export const Component: React.FC<BlockSelectorProps> = (props) => {
    return (
      <Container enabled={props.enabled}>
        {props.block_ids.map((block_id) => {
          const is_selected = props.selected.includes(block_id);
          return (
            <BlockContainer key={block_id}>
              <Text
                selected={is_selected}
                onClick={() => {
                  if (is_selected) {
                    if (props.selected.length === 1) {
                      return;
                    }
                    return props.onChange(props.selected.filter((id) => id !== block_id));
                  }
                  props.onChange(props.selected.concat(block_id));
                }}
              >
                {block_id.replace('minecraft:', '')}
              </Text>
            </BlockContainer>
          );
        })}
      </Container>
    );
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: scroll;
`;

const PalletItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  border-bottom: 1px dashed ${(props) => props.theme['dark-gray']};
`;

type Props = {
  palette: defs.ColorPalette;
  onChange: (item: defs.ColorPaletteItem) => void;
};

export const PalletSelector: React.FC<Props> = (props) => {
  return (
    <Container>
      {props.palette.map((mapping, i) => {
        return (
          <PalletItem key={i}>
            <MultiColorIcon colors={mapping.colors} enabled={mapping.enabled} />
            <BlockSelector.Component
              enabled={mapping.enabled}
              block_ids={mapping.blocks.map((block) => block.id)}
              selected={mapping.selected_block_ids}
              onChange={(block_ids) => {
                props.onChange({
                  ...props.palette[i],
                  selected_block_ids: block_ids
                });
              }}
            />

            <EnabledSelector
              enabled={mapping.enabled}
              onChange={(enabled) => {
                props.onChange({
                  ...props.palette[i],
                  enabled
                });
              }}
            />
          </PalletItem>
        );
      })}
    </Container>
  );
};

export default PalletSelector;
