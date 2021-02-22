import * as pixels from '@cartographer/pixels';
import styled from 'styled-components';
import * as defs from '../defs';
import * as React from 'react';
import * as immer from 'immer';

type Props = {};

type MultiColorIconProps = {
  colors: pixels.defs.RGBColor[];
  style?: React.CSSProperties;
};

const MultiColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  justify-items: stretch;
  width: 30px;
  height: 30px;
`;

const MultiColorSlice = styled.div<{ c: string }>`
  background: ${(props) => props.c};
  display: flex;
  flex-grow: 1;
`;

export const MultiColorIcon: React.FC<MultiColorIconProps> = (props) => {
  return (
    <MultiColorContainer style={props.style}>
      {props.colors.map(([r, g, b], i) => {
        return <MultiColorSlice key={i} c={`rgb(${r}, ${g}, ${b})`} />;
      })}
    </MultiColorContainer>
  );
};

namespace BlockSelector {
  const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  `;

  const BlockContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    cursor: pointer;
  `;

  const Text = styled.p``;

  const SelectionLine = styled.div`
    display: flex;
    flex-grow: 1;
    height: 2px;
    margin-top: 2px;
    background: ${(props) => props.theme.light_blue};
  `;

  type BlockSelectorProps = {
    block_ids: string[];
    selected: string;
    onChange: (block_id: string) => void;
  };
  export const Component: React.FC<BlockSelectorProps> = (props) => {
    return (
      <Container>
        {props.block_ids.map((block_id) => {
          const is_selected = block_id === props.selected;
          return (
            <BlockContainer key={block_id}>
              <Text
                onClick={() => {
                  props.onChange(block_id);
                }}
              >
                {block_id}
              </Text>
              {is_selected ? <SelectionLine /> : null}
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
`;

const PalletItem = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2px;
`;

export const PalletSelector: React.FC<Props> = (props) => {
  const [palette, setPalette] = React.useState<defs.ColorPalette>(
    pixels.data.MC_BLOCK_COLORS.map((mapping) => {
      return {
        colors: mapping.colors.slice(0, 3),
        block_ids: mapping.blocks.map((block) => block.id),
        selected_block_id: mapping.blocks[0].id,
        enabled: true
      };
    })
  );

  return (
    <Container>
      {palette.map((mapping, i) => {
        return (
          <PalletItem key={i}>
            <MultiColorIcon colors={mapping.colors} />
            <BlockSelector.Component
              block_ids={mapping.block_ids}
              selected={mapping.selected_block_id}
              onChange={(block_id) => {
                const next_palette = immer.produce(palette, (draft) => {
                  draft[i].selected_block_id = block_id;
                });
                setPalette(next_palette);
              }}
            />
          </PalletItem>
        );
      })}
    </Container>
  );
};
