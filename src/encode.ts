import { ExtensionCodecType } from "./ExtensionCodec";
import { Encoder } from "./Encoder";

export type EncodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
    maxDepth: number;
    initialBufferSize: number;
    sortKeys: boolean;
  }>
>;

const defaultEncodeOptions = {};

/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
export function encode(value: unknown, options: EncodeOptions = defaultEncodeOptions): Uint8Array {
  const encoder = new Encoder(options.extensionCodec, options.maxDepth, options.initialBufferSize, options.sortKeys);
  encoder.encode(value, 1);
  return encoder.getUint8Array();
}
