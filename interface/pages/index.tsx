import ImageSelector from '../components/image-selector';
import ImagePreview from '../components/image-preview';
import SourceImage from '../components/source-image';
import MultiButton from '../components/multi-button';
import BlockList from '../components/block-list';
import CheckBox from '../components/check-box';

import * as block_palettes from '@cartographer/block-palettes';
import * as generation from '@cartographer/generation';
import * as pixels from '@cartographer/pixels';
import * as rr from 'react-responsive';
import styled from 'styled-components';
import patches from '../patches';
import * as utils from '../utils';
import * as hooks from '../hooks';
import * as defs from '../defs';
import * as React from 'react';
import Head from 'next/head';
import * as _ from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '@fortawesome/free-brands-svg-icons';
import MaterialsList from '../components/materials-list';
import Tooltip from '../components/tooltip';

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

const Warning = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 4px dashed ${(props) => props.theme['dark-red']};
  margin: 5px;
  color: ${(props) => props.theme['light-red']};
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

const MapOptions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
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

export const ClearButton = styled.p`
  font-weight: bold;
  align-self: flex-start;
  margin: 10px;
  color: ${(props) => props.theme.fg2};
  border: 1px dashed ${(props) => props.theme.fg3};
  padding: 3px 7px;
  cursor: pointer;
`;

export default function Root() {
  const [image_data, setImageData] = React.useState<ImageData>();
  const [bounds, setBounds] = React.useState<defs.Bounds>();
  const [saturation, setSaturation] = React.useState(0);
  const [brightness, setBrightness] = React.useState(0);
  const [color_spectrum, setColorSpectrum] = React.useState(pixels.BlockColorSpectrum.Full);
  const [scale_range, setScaleRange] = React.useState<[number, number]>([1, 1]);
  const [scale, setScale] = React.useState<defs.Scale>({ x: 1, y: 1 });
  const [palette, setPalette] = React.useState<defs.ColorPalette>(
    utils.applyPalettePatch(block_palettes.palettes['1.19'], patches[0].patch)
  );
  const [materials_list_visible, showMaterialsList] = React.useState(false);

  const [staircase_alg, setStaircaseAlg] = React.useState(generation.block_generation.StaircaseAlgorithm.Boundary);
  const [support_block_id, setSupportBlockId] = React.useState('minecraft:cobblestone');

  const api = hooks.withAPIWorker();

  const [generating, isGenerating] = React.useState(false);

  const is_small_screen = rr.useMediaQuery({ query: '(max-width: 1750px)' });
  const is_safari =
    !globalThis.window?.OffscreenCanvas ||
    /^((?!chrome|android).)*safari/i.test(globalThis.window?.navigator.userAgent || '');

  const generate = async (type: 'litematic' | 'nbt' | 'json') => {
    if (!image_data || !bounds || !api.current) {
      return;
    }

    const params = {
      image_data,
      scale,
      bounds,
      palette: utils.normalizeColorPalette(palette),
      color_spectrum,
      staircase_alg,
      support_block_id,
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

  return (
    <Container>
      <Head>
        <title>Cartographer</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title>Cartographer</Title>

          <Description style={{ marginLeft: 10 }}>- A map-art generator for Minecraft</Description>
        </div>

        <a target="_blank" href="https://github.com/julienvincent/cartographer">
          <Icon icon={icons.faGithub} />
        </a>
      </Header>

      <Content>
        <Workspace small={is_small_screen}>
          {is_safari ? (
            <Warning>
              Unfortunately Cartographer is not supported on Safari [WebKit]. We depend on some browser API's like
              OffScreenCanvas that are currently missing in Safari WebKit.
              <br />
              <br />
              You will need to switch to a Chrome based browser if you would like to use Cartographer.
            </Warning>
          ) : null}

          {image_data && (
            <ClearButton
              onClick={() => {
                setImageData(undefined);
              }}
            >
              Reset
            </ClearButton>
          )}

          {image_data ? (
            <PreviewContainer>
              <MapOptions style={{ marginTop: is_small_screen ? 10 : 0, marginBottom: 10 }}>
                <CheckBox
                  label="Full color spectrum"
                  label_side="left"
                  tooltip={[
                    "Enabling the full color spectrum will add 3x more colors to the color palette resulting in a more detailed image, however this will also result in 'staircasing' making the map significantly harder to build in survival.",
                    'Staircasing is where blocks are placed at varying heights in order to adjust the hue of adjacent blocks. The hue of a block in a Minecraft map is determined by the height of the block north of it.',
                    'Turn this off if you want a perfectly flat (2D) map thats easy to build.'
                  ]}
                  style={{ marginRight: 15 }}
                  value={color_spectrum === pixels.BlockColorSpectrum.Full}
                  onChange={(value) => {
                    if (value) {
                      return setColorSpectrum(pixels.BlockColorSpectrum.Full);
                    }
                    setColorSpectrum(pixels.BlockColorSpectrum.Flat);
                  }}
                />

                <Tooltip
                  style={{ alignItems: 'center' }}
                  tooltip={[
                    'This scale correlates to the number of maps at zoom level 1 placed side-by-side required in order to display the full image.',
                    'Changing this will result in a more detailed image but will also require you to place significantly more blocks.'
                  ]}
                >
                  <Description style={{ marginRight: 10 }}>Map Scale</Description>

                  <MultiButton
                    disabled={!image_data}
                    style={{ marginRight: 5 }}
                    selected={`${scale.x}`}
                    actions={_.range(1, scale_range[0]).map((option) => {
                      return {
                        name: `${option}`
                      };
                    })}
                    onSelectionChange={(name) => {
                      setScale({
                        ...scale,
                        x: parseInt(name)
                      });
                    }}
                    action_opens_picker
                    prefix="X "
                  />

                  <MultiButton
                    disabled={!image_data}
                    selected={`${scale.y}`}
                    actions={_.range(1, scale_range[1]).map((option) => {
                      return {
                        name: `${option}`
                      };
                    })}
                    onSelectionChange={(name) => {
                      setScale({
                        ...scale,
                        y: parseInt(name)
                      });
                    }}
                    action_opens_picker
                    prefix="Y "
                  />
                </Tooltip>
              </MapOptions>

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
              style={{ margin: 'auto' }}
              onFileSelected={async (image_data) => {
                setScaleRange([Math.ceil(image_data.width / 128), Math.ceil(image_data.height / 128)]);
                setImageData(image_data);
              }}
            />
          )}

          {image_data && bounds ? (
            <>
              <Border small={is_small_screen} />

              <PreviewContainer>
                <ImagePreview
                  style={{ alignSelf: 'center' }}
                  palette={palette}
                  bounds={bounds}
                  image_data={image_data}
                  scale={scale}
                  color_spectrum={color_spectrum}
                  transformations={{
                    saturation,
                    brightness
                  }}
                />

                <Description style={{ marginTop: 10 }}>
                  This is a preview of how the Map should look once placed.
                </Description>

                <Tooltip
                  style={{ marginTop: 10 }}
                  direction="up"
                  tooltip={[
                    'Staircasing is the placement of blocks at varying heights in order to control the color hue of the block south of it. Cartographer implements various algorithms for producing these staircases that have slightly different properties.',
                    'Continuous: Make continuous staircases that never reset back to y=0. This makes it easier to build but may reach the maximum build height on large maps.',
                    'Baseline: Make staircases that continuously reset to y=0 whenever an opportunity arises. This will result in a more compact map but may be harder to build.',
                    'Boundary: Prefer making continuous staircases that never reset except when crossing map boundaries, in which case a single reset is allowed. This allows for most of the benefits of Continuous but should prevent maps from reaching the build-height limit.'
                  ]}
                >
                  <Description style={{ marginRight: 10 }}>Staircase Algorithm</Description>
                  <MultiButton
                    disabled={color_spectrum === pixels.BlockColorSpectrum.Flat}
                    selected={_.upperFirst(staircase_alg)}
                    action_opens_picker
                    onSelectionChange={(name) => setStaircaseAlg(name.toLowerCase() as any)}
                    actions={Object.values(generation.block_generation.StaircaseAlgorithm).map((alg) => {
                      return {
                        name: _.upperFirst(alg)
                      };
                    })}
                  />
                </Tooltip>

                <Tooltip
                  style={{ marginTop: 10 }}
                  direction="up"
                  tooltip={[
                    'This is the block that will be placed below blocks that require support such as falling sand'
                  ]}
                >
                  <Description style={{ marginRight: 10 }}>Support block</Description>
                  <MultiButton
                    selected={support_block_id}
                    action_opens_picker
                    onSelectionChange={(name) => setSupportBlockId(name)}
                    actions={[
                      {
                        name: 'minecraft:cobblestone'
                      },
                      {
                        name: 'minecraft:stone'
                      }
                    ]}
                  />
                </Tooltip>

                <MapOptions style={{ marginTop: 10, marginBottom: 10 }}>
                  <MultiButton
                    style={{ marginRight: 10 }}
                    actions={[
                      {
                        name: 'Show materials list',
                        fn: () => {
                          showMaterialsList(true);
                        }
                      }
                    ]}
                  />

                  <MultiButton
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
                </MapOptions>
              </PreviewContainer>
            </>
          ) : null}
        </Workspace>

        <BlockList palette={palette} onChange={setPalette} />
      </Content>

      {image_data && bounds && materials_list_visible && (
        <MaterialsList
          onClose={() => {
            showMaterialsList(false);
          }}
          palette={palette}
          image_data={image_data}
          scale={scale}
          bounds={bounds}
          color_spectrum={color_spectrum}
          support_block_id={support_block_id}
          transformations={{
            saturation,
            brightness
          }}
        />
      )}
    </Container>
  );
}
