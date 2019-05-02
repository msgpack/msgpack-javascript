import { ExtensionCodec, ExtensionCodecType } from "./ExtensionCodec";
import { Encoder } from "./Encoder";

export type EncodeOptions = Readonly<{
  maxDepth: number;
  extensionCodec: ExtensionCodecType;
}>;

export const DEFAULT_MAX_DEPTH = 100;

export function encode(value: unknown, options: Partial<EncodeOptions> = {}): Array<number> {
  const output: Array<number> = [];

  const context = new Encoder(
    options.maxDepth || DEFAULT_MAX_DEPTH,
    options.extensionCodec || ExtensionCodec.defaultCodec,
  );
  context.encode(output, value, 1);

  return output;
}
