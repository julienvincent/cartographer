/**
 * This is a script for parsing the color mappings from MapArtCraft (https://github.com/rebane2001/mapartcraft/blob/master/src/components/mapart/json/coloursJSON.json)
 */

import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

const final = Object.entries(data as any).reduce((palette: any[], [id, item]: any) => {
  palette.push({
    id,
    colors: [item.tonesRGB.dark, item.tonesRGB.normal, item.tonesRGB.light],
    blocks: Object.values(item.blocks)
      .map((block: any) => {
        if (!block.validVersions['1.19']) {
          console.log(block);
          return [];
        }
        const version = block.validVersions[block.validVersions['1.19'].replace('&', '')];
        if (!version) {
          return [];
        }
        return [
          {
            id: `minecraft:${version.NBTName}`,
            properties: {
              flammable: block.flammable,
              requires_support: block.supportBlockMandatory
            }
          }
        ];
      })
      .flat()
  });

  return palette;
}, []);

console.log(JSON.stringify(final));
