import * as pako from 'pako';
import nbt from 'nbt';

export const serializeNBTData = async (data: object): Promise<Uint8Array> => {
  const nbt_data = Buffer.from(nbt.writeUncompressed(data));
  return pako.gzip(nbt_data);
};
