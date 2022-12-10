import * as Components from '../components';
import styled from 'styled-components';
import * as comlink from 'comlink';
import * as utils from '../utils';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import Head from 'next/head';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

const Body = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(to bottom, rgba(135, 135, 135, 0.3), rgba(135, 135, 135, 0.5));
`;

const Container = styled(Components.Card)`
  flex-direction: column;
  flex-grow: 1;
  margin: 30px;
  padding: 20px;
  background: ${(props) => props.theme.bg0};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-grow: 1;
`;

const Icon = styled(FontAwesomeIcon)`
  background: rgba(194, 194, 194, 0.2);
  color: #c2c2c2;
  border-radius: 50%;
  padding: 10px;
  margin: 0 60px;
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
    <Body>
      <Head>
        <title>Cartographer</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <Container>
        <Header>
          <Components.Selector
            style={{ marginRight: 10 }}
            label="Map Scale"
            selected={scale}
            options={scale_options}
            onSelect={(option) => setMapScale(option as any)}
          />

          <Components.Button onClick={generate} disabled={!image_data} loading={generating}>
            Generate
          </Components.Button>
        </Header>

        <Content>
          {image_data ? (
            <Components.SourceImage
              image_data={image_data}
              scale={scale}
              onBoundsChange={async (bounds) => {
                setBounds(bounds);
              }}
            />
          ) : (
            <Components.ImageSelector
              onFileSelected={async (image_data) => {
                setImageData(image_data);
              }}
            />
          )}

          {image_data && bounds ? (
            <>
              <Icon icon={icons.faSync} style={{ width: 30, height: 30 }} />
              <Components.ImagePreview palette={palette} bounds={bounds} image_data={image_data} scale={scale} />
            </>
          ) : null}

          {/*<Select*/}
          {/*  options={scale_options.map((scale) => {*/}
          {/*    return {*/}
          {/*      value: scale as defs.MAP_SCALE,*/}
          {/*      label: scale as defs.MAP_SCALE*/}
          {/*    };*/}
          {/*  })}*/}
          {/*  value={{*/}
          {/*    value: scale,*/}
          {/*    label: scale*/}
          {/*  }}*/}
          {/*  onChange={(selection) => {*/}
          {/*    // @ts-ignore*/}
          {/*    setMapScale(selection.value);*/}
          {/*  }}*/}
          {/*/>*/}

          {/*<button disabled={!image_data} onClick={generate}>*/}
          {/*  generate*/}
          {/*</button>*/}

          {/*<Components.PalletSelector palette={palette} onPaletteChange={setPalette} />*/}
        </Content>
      </Container>
    </Body>
  );
}
