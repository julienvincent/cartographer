import PaletteSelector from '../components/pallete-selector';
import SearchBox from '../components/search-box';
import styled from 'styled-components';
import * as defs from '../defs';
import * as React from 'react';
import Fuse from 'fuse.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 2px dashed ${(props) => props.theme['dark-yellow']};
  border-left: 2px dashed ${(props) => props.theme['dark-yellow']};
  margin-bottom: 5px;
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

  const blocks = props.palette.map((item) => item.blocks.map((block) => block.id)).flat();
  const fuse = new Fuse(blocks, {
    threshold: 0.5
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

  return (
    <Container>
      <Header>
        <Title>Block Palette</Title>

        <SearchBox value={search} onChange={setSearch} />
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
                selected_block_id: item.selected_block_id
              };
            })
          );
        }}
      />
    </Container>
  );
};

export default BlockList;
