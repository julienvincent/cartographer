import ImageSelector from '../components/image-selector';
import ImagePreview from '../components/image-preview';
import SourceImage from '../components/source-image';
import MultiButton from '../components/multi-button';
import BlockList from '../components/block-list';

import styled from 'styled-components';
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

const Workspace = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  flex-grow: 1;
`;

const Border = styled.div`
  flex-direction: column;
  border-left: 2px dashed ${(props) => props.theme['dark-orange']};
  opacity: 0.5;
  height: 100%;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme['light-purple']};
  border: 1px dashed ${(props) => props.theme['dark-purple']};
  padding: 10px;
  cursor: pointer;
`;

export default function Root() {
  const [image_data, setImageData] = React.useState<ImageData>();
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const [scale, setMapScale] = React.useState<defs.MAP_SCALE>(defs.MAP_SCALE.X128);
  const [palette, setPalette] = React.useState<defs.ColorPalette>(utils.createDefaultPalette());
  const api = hooks.withAPIWorker();

  const [generating, isGenerating] = React.useState(false);

  const generate = async () => {
    if (!image_data || !api.current) {
      return;
    }

    isGenerating(true);
    const schema_nbt = await api.current.generateLitematicaSchema(
      image_data,
      scale,
      utils.normalizeColorPalette(palette)
    );
    utils.download(schema_nbt, 'map.litematic');
    isGenerating(false);
  };

  const scale_options = Object.values(defs.MAP_SCALE).filter((value) => {
    return typeof value === 'number';
  });

  return (
    <Container>
      <Head>
        <title>Cartographer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Mono" />
      </Head>

      <Header>
        <Title>Cartographer</Title>

        <a target="_blank" href="https://github.com/julienvincent/cartographer">
          <Icon icon={icons.faGithub} />
        </a>
      </Header>

      <Content>
        <Workspace>
          {image_data ? (
            <PreviewContainer>
              <MultiButton
                style={{ marginBottom: 15 }}
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
              <Border />
              <PreviewContainer>
                <ImagePreview palette={palette} bounds={bounds} image_data={image_data} scale={scale} />

                <MultiButton
                  style={{ marginTop: 15 }}
                  disabled={!image_data}
                  loading={generating}
                  actions={[
                    {
                      name: 'Generate Litematic',
                      fn: generate
                    },
                    {
                      name: 'Generate JSON',
                      fn: generate
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
