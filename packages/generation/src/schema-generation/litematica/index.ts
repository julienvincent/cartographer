import * as litematica from '@cartographer/litematica';
import { BlockSpace } from '../../block-generation';

/**
 * Converts BlockSpace data into a litematica schema. The resulting schema data will need to be serialized
 * using the 'nbt' module before exporting
 */
export const generateLitematicaSchema = (block_space: BlockSpace) => {
  return litematica.generateSchematicNBT({
    blocks: block_space,
    name: 'Map',
    author: 'Cartographer',
    description: 'MapArt schematic generated by Cartographer'
  });
};
