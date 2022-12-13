import * as pixels from '@cartographer/pixels';
import styled from 'styled-components';
import SearchBox from './search-box';
import * as utils from '../utils';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import Fuse from 'fuse.js';

import Loader from './loader';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  border: 4px dashed ${(props) => props.theme['dark-purple']};
  background-color: ${(props) => props.theme['bg0-soft']};
  min-width: 70%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 2px dashed ${(props) => props.theme['dark-purple']};
`;

const Title = styled.p`
  color: ${(props) => props.theme['light-yellow']};
`;

const CloseButton = styled.p`
  margin-right: 15px;
  color: ${(props) => props.theme['light-red']};
  border: 1px dashed ${(props) => props.theme['dark-red']};
  padding: 2px 5px;
  cursor: pointer;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px dashed ${(props) => props.theme.fg4};
  margin-top: 5px;
  padding: 10px;
`;

const RowId = styled.p`
  color: ${(props) => props.theme['dark-aqua']};
  font-weight: bold;
`;

const RowCount = styled.p`
  color: ${(props) => props.theme['dark-orange']};
  font-weight: bold;
`;

type Props = {
  onClose: () => void;

  image_data: ImageData;
  scale: defs.MAP_SCALE;
  color_spectrum: pixels.defs.BlockColorSpectrum;

  transformations: {
    saturation: number;
    brightness: number;
  };

  palette: defs.ColorPalette;
};

export const MaterialsList: React.FC<Props> = (props) => {
  const [materials, setMaterials] = React.useState<{ id: string; count: number }[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const api = hooks.withAPIWorker();

  React.useEffect(() => {
    (async () => {
      if (!api.current) {
        return;
      }

      setLoading(true);
      const materials_list = await api.current.generateMaterialsList({
        image_data: props.image_data,
        scale: props.scale,
        color_spectrum: props.color_spectrum,
        palette: utils.normalizeColorPalette(props.palette),
        transformations: props.transformations
      });

      setLoading(false);
      setMaterials(
        Object.entries(materials_list).map(([id, count]) => {
          return { id, count };
        })
      );
    })();
  }, [
    props.image_data,
    api.current,
    props.palette,
    props.scale,
    props.transformations.brightness,
    props.transformations.saturation,
    props.color_spectrum
  ]);

  const fuse = new Fuse(materials, {
    keys: ['id'],
    threshold: 0.3
  });

  let filtered = materials;
  if (search) {
    filtered = fuse.search(search).map((item) => item.item);
  }

  return (
    <Container
      onClick={() => {
        props.onClose();
      }}
    >
      <Content
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Header>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CloseButton onClick={props.onClose}>X</CloseButton>

            <Title>Materials List</Title>
          </div>

          <SearchBox value={search} onChange={setSearch} />
        </Header>

        {loading && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}

        <TableContainer>
          {filtered.map((material) => {
            return (
              <Row key={material.id}>
                <RowId>{material.id}</RowId>
                <RowCount>{material.count}</RowCount>
              </Row>
            );
          })}
        </TableContainer>
      </Content>
    </Container>
  );
};

export default MaterialsList;
