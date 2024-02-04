#!/usr/bin/env ts-node

/**
 * This is a script for parsing the color mappings from MapArtCraft (https://github.com/rebane2001/mapartcraft/blob/master/src/components/mapart/json/coloursJSON.json)
 */

import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const target_version = process.argv[3];

const tupleToRgb = (color: [number, number, number]) => {
  const [r, g, b] = color;
  return { r, g, b };
};

const final = Object.entries(data as any).reduce((palette: any[], [id, item]: any) => {
  palette.push({
    id,
    colors: [tupleToRgb(item.tonesRGB.light), tupleToRgb(item.tonesRGB.normal), tupleToRgb(item.tonesRGB.dark)],
    blocks: Object.values(item.blocks)
      .map((block: any) => {
        if (!block.validVersions[target_version]) {
          return [];
        }
        let version = block.validVersions[target_version];
        if (typeof version === 'string') {
          version = block.validVersions[version.replace('&', '')];
        }
        if (!version) {
          return [];
        }
        return [
          {
            id: `minecraft:${version.NBTName}`,
            attributes: {
              flammable: block.flammable,
              requires_support: block.supportBlockMandatory
            },
            properties: version.NBTArgs
          }
        ];
      })
      .flat()
  });

  return palette;
}, []);

console.log(JSON.stringify(final));
