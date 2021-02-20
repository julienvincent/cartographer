import zlib from 'zlib';
import nbt from 'nbt';

export const serializeNBTData = (data: object): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    return zlib.gzip(Buffer.from(nbt.writeUncompressed(data)), (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};
