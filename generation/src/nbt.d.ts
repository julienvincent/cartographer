declare module 'nbt' {
  export type ParseCallback = (error: Error | null, data: object) => void;
  export function parse(data: object, cb: ParseCallback): void;
  export function writeUncompressed(data: object): Uint8Array;
}
