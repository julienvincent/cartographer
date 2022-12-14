import PaletteSelector, { EnabledSelector } from '../components/pallete-selector';
import SearchBox from '../components/search-box';
import MultiButton from './multi-button';
import styled from 'styled-components';
import * as defs from '../defs';
import * as React from 'react';
import Fuse from 'fuse.js';

import * as utils from '../utils';
import patches from '../patches';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  border-left: 2px dashed ${(props) => props.theme['dark-yellow']};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 2px dashed ${(props) => props.theme['dark-yellow']};
`;

const Title = styled.p`
  color: ${(props) => props.theme['light-yellow']};
`;

type Props = {
  palette: defs.ColorPalette;
  onChange: (palette: defs.ColorPalette) => void;
};

export const BlockList: React.FC<Props> = (props) => {
  const [search, setSearch] = React.useState('');
  const [palette_preset, setPalettePreset] = React.useState('Full');

  const blocks = props.palette.map((item) => item.blocks.map((block) => block.id)).flat();
  const fuse = new Fuse(blocks, {
    threshold: 0.3
  });

  let palette = props.palette;
  if (search) {
    const filtered = fuse.search(search);
    palette = props.palette.reduce((palette: defs.ColorPalette, item) => {
      const match = filtered.find((filtered) => {
        return item.blocks.map((block) => block.id).includes(filtered.item);
      });
      if (match) {
        palette.push({
          ...item,
          blocks: item.blocks.filter((block) => filtered.map(({ item }) => item).includes(block.id))
        });
      }
      return palette;
    }, []);
  }

  let shared_selector: boolean | -1 = -1;
  const [all_enabled, all_disabled] = props.palette.reduce(
    ([enabled, disabled]: [boolean, boolean], item) => {
      if (item.enabled) {
        if (disabled) {
          return [enabled, false];
        }
      } else {
        if (enabled) {
          return [false, disabled];
        }
      }
      return [enabled, disabled];
    },
    [true, true]
  );

  if (all_enabled) {
    shared_selector = true;
  } else if (all_disabled) {
    shared_selector = false;
  } else {
    shared_selector = -1;
  }

  return (
    <Container>
      <Header>
        <Title>Block Palette</Title>

        <SearchBox value={search} onChange={setSearch} />
      </Header>

      <Header style={{ marginBottom: 5 }}>
        <MultiButton
          action_opens_picker
          selected={palette_preset}
          actions={patches.map((patch) => {
            return {
              name: patch.name
            };
          })}
          onSelectionChange={(name) => {
            const patch = patches.find((patch) => patch.name === name);
            if (patch) {
              props.onChange(utils.createDefaultPalette(patch.patch));
              setPalettePreset(name);
            }
          }}
        />

        <EnabledSelector
          enabled={shared_selector}
          onChange={(enabled) => {
            props.onChange(
              props.palette.map((item) => {
                return {
                  ...item,
                  enabled
                };
              })
            );
          }}
        ></EnabledSelector>
      </Header>

      <PaletteSelector
        palette={palette}
        onChange={(item) => {
          props.onChange(
            props.palette.map((original) => {
              if (original.id !== item.id) {
                return original;
              }
              return {
                ...original,
                enabled: item.enabled,
                selected_block_ids: item.selected_block_ids
              };
            })
          );
        }}
      />
    </Container>
  );
};

export default BlockList;
