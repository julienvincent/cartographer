export type BlockAttributes = {
  requires_support?: boolean;
  flammable?: boolean;
  liquid?: boolean;
};

export type MCBlock = {
  /**
   * The minecraft block ID. This will be something like `minecraft:air`
   */
  id: string;

  /**
   * Stores useful attributes about the block that can be used during the schema block space generation
   */
  attributes?: BlockAttributes;

  /**
   * Stores properties about how the block should be placed. This could be things like `{axis: 'y'}` on a
   * directional block such as `minecraft:birch_log` to indicate the direction the block is facing.
   */
  properties?: Record<string, string>;
};
