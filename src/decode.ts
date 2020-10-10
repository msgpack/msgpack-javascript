import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { ContextOf, SplitUndefined } from "./context";

export type DecodeOptions<ContextType = undefined> = Readonly<
  Partial<{
    extensionCodec: ExtensionCodecType<ContextType>;

    /**
     * Maximum string length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxStrLength: number;
    /**
     * Maximum binary length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxBinLength: number;
    /**
     * Maximum array length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxArrayLength: number;
    /**
     * Maximum map length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxMapLength: number;
    /**
     * Maximum extension length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxExtLength: number;
  }>
> &
  ContextOf<ContextType>;

export const defaultDecodeOptions: DecodeOptions = {};

/**
 * It decodes a MessagePack-encoded buffer.
 *
 * This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
 */
export function decode<ContextType = undefined>(
  buffer: ArrayLike<number> | ArrayBuffer,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): unknown {
  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );
  return decoder.decode(buffer);
}
