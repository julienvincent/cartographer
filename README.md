# Cartographer

A web-based tool for converting images into Minecraft map-art, formatted in a variety of ways (most commonly in the `litematica` format). These schematics can then be used as a blueprint for building map-art in Minecraft.

## About

There are some alternatives to this tool out in the wild, most notably being [mapartcraft](https://rebane2001.com/mapartcraft/), however none of the existing tools could generate map schematics in a format compatible with the excellent [Litematica](https://github.com/maruohon/litematica) mod. As we want to use Litematica for building the actual map in survival we decided to build a new tool that could produce files of this format and at the same time improve on some other things such as:

- Better interface for working with the loaded image
  - Live preview
  - Interactive selection box
  - Image manipulation tools (saturation, brightness)
- Ability to manually edit the generated map-art to tweak/fix things
- Perform all generation entirely on the browser, so not having to wait for any server-side queues
- Simpler and more direct output format (.schematic files, json, .nbt) that don't need to be converted via third party tools

## Components

- [@cartographer/litematica](./litematica) - A set of utilities for generating Litematica compatible schema NBT data
- [@cartographer/generation](./generation) - Contains the core block generation algorithm as well as transformers to convert the generated map to other formats like `litematica` and `nbt`.
- [@cartographer/pixels](./pixels) - Contains block palette data and tools for working with image data. Essentially conversion tools for 'pixels' where a pixel could be an image pixel or a MC block

## JSON output format

Internally the generation algorithm produces a relatively simple data-structure which represents all blocks in their appropriate positions in 3D space. This intermediate data structure is then converted into whatever target output format is requested. The tool accepts exporting this data structure as standard JSON which allows you to build your own tools and translation algorithms for target formats not natively supported by Cartographer.

This data structure looks as follows:

```json
[
  [
    {
      "id": "minecraft:stone",
      "y_offset": 0 // 0-2
    }
  ]
]
```

## Acknowledgements

The block palette data was taken directly from [rebane2001/mapartcraft](https://github.com/rebane2001/mapartcraft) and converted to the format used internally by cartographer. This conversion was done using [this script](./scripts/parse.ts).

## Roadmap/Features

- Allow selecting multiple blocks in the color palette and balance equally between them when generating the block space. This will allow for a better distribution in accordance with the material quantities available in the users world. For example, if the user has 10 cobblestone and 10 stone, and they need 20 blocks of either, they shouldn't need to mine an additional 10 of one of the block types but rather should be able to use some cobblestone and some stone to complete the map, because they are equivalent.
- Allow selecting the block type to be used under blocks that require support.
- Allow creating non-symmetric map scales. For example, allow creating a `128x256` scale map.
- Add a minecraft version selector with version specific block palettes
- Add support for uploading custom block palettes

## Authors

- [@julienvincent](https://github.com/julienvincent)
- [@nicholaswrobinson](https://github.com/nicholaswrobinson)
