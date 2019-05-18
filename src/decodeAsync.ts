import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { defaultDecodeOptions } from "./decode";

// the same structure as DecodeOptions but has different doc.
export type DecodeAsyncOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;

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
>;

export const defaultDecodeAsyncOptions = defaultDecodeOptions;

export async function decodeAsync(
  stream: AsyncIterable<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
): Promise<unknown> {
  const decoder = new Decoder(
    options.extensionCodec,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );
  return decoder.decodeOneAsync(stream);
}
