import { Decoder } from "./Decoder";
import type { ExtensionCodecType } from "./ExtensionCodec";
import type { ContextOf, SplitUndefined } from "./context";

export type DecodeOptions<ContextType = undefined> = Readonly<
  Partial<{
    extensionCodec: ExtensionCodecType<ContextType>;

    /**
     * Maximum string length.
     *
     * Defaults to 4_294_967_295 (UINT32_MAX).
     */
    maxStrLength: number;
    /**
     * Maximum binary length.
     *
     * Defaults to 4_294_967_295 (UINT32_MAX).
     */
    maxBinLength: number;
    /**
     * Maximum array length.
     *
     * Defaults to 4_294_967_295 (UINT32_MAX).
     */
    maxArrayLength: number;
    /**
     * Maximum map length.
     *
     * Defaults to 4_294_967_295 (UINT32_MAX).
     */
    maxMapLength: number;
    /**
     * Maximum extension length.
     *
     * Defaults to 4_294_967_295 (UINT32_MAX).
     */
    maxExtLength: number;
  }>
> &
  ContextOf<ContextType>;

const getDecoder = (options: any) => new Decoder(
  options.extensionCodec,
  (options as typeof options & { context: any }).context,
  options.maxStrLength,
  options.maxBinLength,
  options.maxArrayLength,
  options.maxMapLength,
  options.maxExtLength,
);

export const defaultDecodeOptions: DecodeOptions = {};
const defaultDecoder = getDecoder(defaultDecodeOptions);

/**
 * It decodes a single MessagePack object in a buffer.
 *
 * This is a synchronous decoding function.
 * See other variants for asynchronous decoding: {@link decodeAsync()}, {@link decodeStream()}, or {@link decodeArrayStream()}.
 *
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export function decode<ContextType = undefined>(
  buffer: ArrayLike<number> | BufferSource,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): unknown {
  const decoder = options === defaultDecodeOptions ? defaultDecoder : getDecoder(options);
  return decoder.decode(buffer);
}

/**
 * It decodes multiple MessagePack objects in a buffer.
 * This is corresponding to {@link decodeMultiStream()}.
 *
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export function decodeMulti<ContextType = undefined>(
  buffer: ArrayLike<number> | BufferSource,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): Generator<unknown, void, unknown> {
  const decoder = options === defaultDecodeOptions ? defaultDecoder : getDecoder(options);
  return decoder.decodeMulti(buffer);
}
