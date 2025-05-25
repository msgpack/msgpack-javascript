import { Decoder } from "./Decoder.ts";
import type { DecoderOptions } from "./Decoder.ts";
import type { SplitUndefined } from "./context.ts";

/**
 * It decodes a single MessagePack object in a buffer.
 *
 * This is a synchronous decoding function.
 * See other variants for asynchronous decoding: {@link decodeAsync}, {@link decodeMultiStream}, or {@link decodeArrayStream}.
 *
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export function decode<ContextType = undefined>(
  buffer: ArrayLike<number> | ArrayBufferView | ArrayBufferLike,
  options?: DecoderOptions<SplitUndefined<ContextType>>,
): unknown {
  const decoder = new Decoder(options);
  return decoder.decode(buffer);
}

/**
 * It decodes multiple MessagePack objects in a buffer.
 * This is corresponding to {@link decodeMultiStream}.
 *
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export function decodeMulti<ContextType = undefined>(
  buffer: ArrayLike<number> | BufferSource,
  options?: DecoderOptions<SplitUndefined<ContextType>>,
): Generator<unknown, void, unknown> {
  const decoder = new Decoder(options);
  return decoder.decodeMulti(buffer);
}
