import { ExtensionCodecType } from "./ExtensionCodec";
import { Encoder } from "./Encoder";

export type EncodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
    maxDepth: number;
    initialBufferSize: number;
    sortKeys: boolean;

    /**
     * If `true`, non-integer numbers are encoded in float32, not in float64 (the default).
     *
     * Only use it if precisions don't matter.
     */
    forceFloat32: boolean;
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
  const encoder = new Encoder(
    options.extensionCodec,
    options.maxDepth,
    options.initialBufferSize,
    options.sortKeys,
    options.forceFloat32,
  );
  encoder.encode(value, 1);
  return encoder.getUint8Array();
}
