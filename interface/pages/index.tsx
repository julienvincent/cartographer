import ImageSelector from '../components/image-selector';
import ImagePreview from '../components/image-preview';
import SourceImage from '../components/source-image';
import MultiButton from '../components/multi-button';
import BlockList from '../components/block-list';

import * as rr from 'react-responsive';
import styled from 'styled-components';
import patches from '../patches';
import * as utils from '../utils';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import Head from 'next/head';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-brands-svg-icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: ${(props) => props.theme.bg0};
`;

const Header = styled.div<{ border_left?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 2px dashed ${(props) => props.theme['dark-yellow']};
  border-left: ${(props) => (props.border_left ? `2px dashed ${props.theme['dark-yellow']}` : 'none')};
`;

const Title = styled.p`
  color: ${(props) => props.theme['light-yellow']};
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-grow: 1;
  overflow: hidden;
`;

const Workspace = styled.div<{ small: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.small ? 'flex-start' : 'space-around')};
  flex-direction: ${(props) => (props.small ? 'column' : 'row')};
  overflow-y: auto;
  flex-grow: 1;
`;

const Border = styled.div<{ small: boolean }>`
  flex-direction: column;
  opacity: 0.5;
  ${(props) => `${props.small ? 'border-bottom' : 'border-left'}: 2px dashed ${props.theme['dark-orange']}`};
  ${(props) => `${props.small ? 'width' : 'height'}: 100%`};
  ${(props) => `${props.small ? 'margin: 10px 0px' : 'margin: 0px 10px'}`};
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme['light-purple']};
  border: 1px dashed ${(props) => props.theme['dark-purple']};
  padding: 5px;
  cursor: pointer;
`;

export const Description = styled.p`
  color: ${(props) => props.theme.fg2};
`;

export default function Root() {
  const [image_data, setImageData] = React.useState<ImageData>();
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const [saturation, setSaturation] = React.useState(0);
  const [brightness, setBrightness] = React.useState(0);
  const [scale, setMapScale] = React.useState<defs.MAP_SCALE>(defs.MAP_SCALE.X128);
  const [palette, setPalette] = React.useState<defs.ColorPalette>(utils.createDefaultPalette(patches[0].patch));
  const api = hooks.withAPIWorker();

  const [generating, isGenerating] = React.useState(false);

  const is_small_screen = rr.useMediaQuery({ query: '(max-width: 1750px)' });

  const generate = async (type: 'litematic' | 'nbt' | 'json') => {
    if (!image_data || !api.current) {
      return;
    }

    const params = {
      image_data,
      scale,
      palette: utils.normalizeColorPalette(palette),
      transformations: {
        saturation,
        brightness
      }
    };

    isGenerating(true);
    switch (type) {
      case 'litematic': {
        const schema_nbt = await api.current.generateLitematicaSchema(params);
        utils.download(schema_nbt, 'map.litematic');
        break;
      }
      case 'nbt': {
        const nbt = await api.current.generateMapNBT(params);
        utils.download(nbt, 'map.nbt');
        break;
      }
      case 'json': {
        const json = await api.current.generateMapJSON(params);
        utils.download(json, 'map.json');
        break;
      }
    }
    isGenerating(false);
  };

  const scale_options = Object.values(defs.MAP_SCALE).filter((value) => {
    return typeof value === 'number';
  });

  return (
    <Container>
      <Head>
        <title>Cartographer</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header>
        <Title>Cartographer</Title>

        <a target="_blank" href="https://github.com/julienvincent/cartographer">
          <Icon icon={icons.faGithub} />
        </a>
      </Header>

      <Content>
        <Workspace small={is_small_screen}>
          {image_data ? (
            <PreviewContainer>
              <MultiButton
                style={{ marginBottom: 10, marginTop: is_small_screen ? 10 : 0 }}
                disabled={!image_data}
                selection={{
                  fn: () => {},
                  name: scale as unknown as string
                }}
                actions={scale_options.map((option) => {
                  return {
                    fn: () => {},
                    name: option as string
                  };
                })}
                onSelectionChange={(action) => {
                  setMapScale(action.name as unknown as defs.MAP_SCALE);
                }}
                action_opens_picker
                prefix="Map Scale - "
              />

              <SourceImage
                image_data={image_data}
                scale={scale}
                onBoundsChange={async (bounds) => {
                  setBounds(bounds);
                }}
                saturation={saturation}
                onSaturationChange={async (value) => {
                  setSaturation(value);
                }}
                brightness={brightness}
                onBrightnessChange={async (value) => {
                  setBrightness(value);
                }}
              />
            </PreviewContainer>
          ) : (
            <ImageSelector
              onFileSelected={async (image_data) => {
                setImageData(image_data);
              }}
            />
          )}

          {image_data && bounds ? (
            <>
              <Border small={is_small_screen} />

              <PreviewContainer>
                <ImagePreview
                  palette={palette}
                  bounds={bounds}
                  image_data={image_data}
                  scale={scale}
                  transformations={{
                    saturation,
                    brightness
                  }}
                />

                <Description style={{ marginTop: 10 }}>
                  This is a preview of how the Map itself should look once placed.
                </Description>

                <MultiButton
                  style={{ marginTop: 10, marginBottom: 10 }}
                  disabled={!image_data}
                  loading={generating}
                  actions={[
                    {
                      name: 'Generate Litematic',
                      fn: () => generate('litematic')
                    },
                    {
                      name: 'Generate NBT',
                      fn: () => generate('nbt')
                    },
                    {
                      name: 'Generate JSON',
                      fn: () => generate('json')
                    }
                  ]}
                />
              </PreviewContainer>
            </>
          ) : null}
        </Workspace>

        <BlockList palette={palette} onChange={setPalette} />
      </Content>
    </Container>
  );
}
