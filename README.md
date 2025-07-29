# Cartographer

A web-based tool for converting images into Minecraft map-art, formatted in a variety of ways (most commonly in the `litematica` format). These schematics can then be used as a blueprint for building map-art in Minecraft.

## Usage

### setup
to build the project for the standalone version or to run it, you can install dependency and build the project by running these command:
```sh
pnpm install && pnpm run build
```

#### pnpm
then you can serve the project by moving to the `./interface` folder, then run `pnpm start`
```sh
cd ./interface
pnpm run start
```

#### standalone
or to use the standalone version of the project you can move to the `./interface/build/standalone` folder then run the `server.js` like so :
```sh
cp -r ./interface/build/static ./interface/build/standalone/build
cd ./interface/build/standalone
node ./server.js
```
> [!WARNING]
> for some reason nextjs doesn't automatically move static folder from the build
> folder into the `./standalone/build` folder, so be sure to add the 
> `build/static` into the `build/standalone/build` folder

### docker
or skip everything and just deploy with docker
```sh
docker image rm cartographer:latest    #remove existing cartographer image
docker build . -t cartographer:latest
docker run --rm -p 3000:3000 --name cartographer -it cartographer:latest
``` 

or even better, just `up` it

```sh
docker compose up -d
```

## About

There are already some good implementations/alternatives to this tool out in the wild, most notably being [mapartcraft](https://rebane2001.com/mapartcraft/), however I found their interfaces very clunky to work in and hard to iterate fluidly on a map-art idea. I also wanted to add features that were missing and add support for outputting in alternative data formats such as `.litematic` files for the excellent [Litematica](https://github.com/maruohon/litematica) mod.

Some features of this tool:

- Clean, fluid interface for working with the loaded image
  - Live preview
  - Interactive selection/crop box
  - Image manipulation tools (saturation, brightness)
- Perform all generation entirely on the browser
- Various output formats (.schematic files, .json, .nbt) that don't need to be converted via third party tools
- Allow selecting multiple blocks in the color palette and balance equally between them when generating the block space. This allows for a better distribution in accordance with the material quantities available in the users world. For example, if the user has 10 cobblestone and 10 stone, and they need 20 blocks of either, they shouldn't need to mine an additional 10 of one type but rather should be able to use both their cobblestone and their stone to complete the map.
- Various staircasing algorithms
- Material list view

## Components

- [@cartographer/litematica](./packages/litematica) - A set of utilities for generating Litematica compatible schematics
- [@cartographer/generation](./packages/generation) - Contains the core block generation algorithm as well as transformers to convert the generated map to other formats like `litematica` and `nbt`.
- [@cartographer/pixels](./packages/pixels) - Contains block palette data and tools for working with image data. Essentially conversion tools for 'pixels' where a pixel could be an image pixel or a MC block
- [@cartographer/block-palettes](./packages/block-palettes) - Curated block-palette data

## JSON output format

Internally the generation algorithm produces a relatively simple data-structure which represents all blocks in their appropriate positions in 3D space. This intermediate data structure is then converted into whatever target output format is requested. The tool accepts exporting this data structure as standard JSON which allows you to build your own tools and translation algorithms for target formats not natively supported by Cartographer.

This data structure looks as follows:

```json
[
  {
    "id": "minecraft:birch_log",
    "properties": {"axis": "y"},
    "hue": 1,
    "x": 0,
    "y": 1,
    "z": 0
  }
]
```

## Acknowledgements

The block palette data was taken directly from [rebane2001/mapartcraft](https://github.com/rebane2001/mapartcraft) and converted to the format used internally by cartographer. This conversion was done using [this script](./scripts/parse.ts).

## Roadmap/Features

- Add support for uploading custom block palettes.
- Ability to manually edit the generated map-art to tweak/fix things
- Deal with infection blocks like grass or nylium

## Authors

- [@julienvincent](https://github.com/julienvincent)
- [@nicholaswrobinson](https://github.com/nicholaswrobinson)
