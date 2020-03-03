import { ExtensionCodecType } from "./ExtensionCodec";
import { Encoder } from "./Encoder";
import { ContextOf, SplitUndefined } from "./context";

export type EncodeOptions<ContextType = undefined> = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType<ContextType>;
    maxDepth: number;
    initialBufferSize: number;
    sortKeys: boolean;

    /**
     * If `true`, non-integer numbers are encoded in float32, not in float64 (the default).
     *
     * Only use it if precisions don't matter.
     */
    forceFloat32: boolean;

    /**
     * If `true`, an object property with `undefined` value are ignored.
     * e.g. `{ foo: undefined }` will be encoded as `{}`, as `JSON.stringify()` does.
     *
     * The default is `false`. Note that it needs more time to encode.
     */
    ignoreUndefined: boolean;
  }>
> &
  ContextOf<ContextType>;

const defaultEncodeOptions: EncodeOptions = {};

/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
export function encode<ContextType>(
  value: unknown,
  options: EncodeOptions<SplitUndefined<ContextType>> = defaultEncodeOptions as any,
): Uint8Array {
  const encoder = new Encoder<ContextType>(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxDepth,
    options.initialBufferSize,
    options.sortKeys,
    options.forceFloat32,
    options.ignoreUndefined,
  );
  encoder.encode(value, 1);
  return encoder.getUint8Array();
}
