import * as Components from '../components';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import * as comlink from 'comlink';
import * as utils from '../utils';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import Head from 'next/head';

const Select = dynamic(() => import('react-select'), { ssr: false });

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

export default function Root() {
  const [image_data, setImageData] = React.useState<ImageData>();
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const [scale, setMapScale] = React.useState<defs.MAP_SCALE>(defs.MAP_SCALE.X128);
  const [palette, setPalette] = React.useState<defs.ColorPalette>(utils.createDefaultPalette());
  const api = hooks.withAPIWorker();

  const generate = async () => {
    if (!image_data || !api.current) {
      return;
    }

    const schema_nbt = await api.current.generateLitematicaSchema(
      comlink.transfer(image_data, [image_data.data.buffer]),
      scale,
      utils.normalizeColorPalette(palette)
    );
    utils.download(schema_nbt, 'map.litematic');
  };

  const scale_options = Object.values(defs.MAP_SCALE).filter((value) => {
    return typeof value === 'number';
  });

  return (
    <div>
      <Head>
        <title>Cartographer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Components.ImageSelector
        onFileSelected={async (image_data) => {
          setImageData(image_data);
        }}
      />

      <Container>
        {image_data ? (
          <Components.SourceImage
            image_data={image_data}
            scale={scale}
            onBoundsChange={async (bounds) => {
              setBounds(bounds);
            }}
          />
        ) : null}

        {image_data && bounds ? (
          <Components.ImagePreview
            palette={palette}
            bounds={bounds}
            style={{ marginLeft: 20 }}
            image_data={image_data}
            scale={scale}
          />
        ) : null}
      </Container>

      <Select
        options={scale_options.map((scale) => {
          return {
            value: scale as defs.MAP_SCALE,
            label: scale as defs.MAP_SCALE
          };
        })}
        value={{
          value: scale,
          label: scale
        }}
        onChange={(selection) => {
          // @ts-ignore
          setMapScale(selection.value);
        }}
      />

      <button disabled={!image_data} onClick={generate}>
        generate
      </button>

      <Components.PalletSelector palette={palette} onPaletteChange={setPalette} />
    </div>
  );
}
