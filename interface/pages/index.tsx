import * as generation from '@cartographer/generation';
import * as pixels from '@cartographer/pixels';
import * as Components from '../components';
import styled from 'styled-components';
import Select from 'react-select';
import * as defs from '../defs';
import * as React from 'react';
import Head from 'next/head';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

export default function Root() {
  const [file, setFile] = React.useState<File>();
  const [image_data, setImageData] = React.useState<ImageData>();
  const [scale, setMapScale] = React.useState<defs.MAP_SCALE>(defs.MAP_SCALE.X128);

  const downloadURL = (data: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    a.setAttribute('style', 'display: none');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const generate = async () => {
    if (!image_data) {
      return;
    }

    const pixel_grid = pixels.conversion.convertImageDataToPixelGrid(image_data);
    const scaled_pixel_grid = pixels.conversion.scaleDownPixelGrid(pixel_grid, scale, scale);
    const color_converted = pixels.conversion.convertPixelGridColorsForMC(scaled_pixel_grid);
    const blocks = pixels.conversion.convertPixelGridToMCBlocks(color_converted);

    console.log('before');
    const block_space = generation.block_generation.buildBlockSpace(blocks);

    const nbt = generation.schema_generation.litematica.generateSchematicNBT(block_space);
    console.log('done');
    const data = await generation.serialization.serializeNBTData(nbt);
    console.log('done 2');

    const data_url = URL.createObjectURL(
      new Blob([data] as any, {
        type: 'application/octet-stream'
      })
    );
    downloadURL(data_url, 'awesome.litematic');
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
        onFileSelected={(file) => {
          setFile(file);
        }}
      />

      <Container>
        {file ? <Components.SourceImage file={file} onImageDataChange={setImageData} /> : null}
        {image_data ? (
          <Components.ImagePreview style={{ marginLeft: 20 }} image_data={image_data} scale={scale} />
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
          if (!selection) {
            return;
          }
          setMapScale(selection.value as defs.MAP_SCALE);
        }}
      />

      <button disabled={!image_data} onClick={generate}>
        generate
      </button>

      <Components.PalletSelector />
    </div>
  );
}
