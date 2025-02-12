import { Decoder } from "./Decoder.ts";
import { ensureAsyncIterable } from "./utils/stream.ts";
import type { DecoderOptions } from "./Decoder.ts";
import type { ReadableStreamLike } from "./utils/stream.ts";
import type { SplitUndefined } from "./context.ts";

/**
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export async function decodeAsync<ContextType = undefined>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options?: DecoderOptions<SplitUndefined<ContextType>>,
): Promise<unknown> {
  const stream = ensureAsyncIterable(streamLike);
  const decoder = new Decoder(options);
  return decoder.decodeAsync(stream);
}

/**
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export function decodeArrayStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options?: DecoderOptions<SplitUndefined<ContextType>>,
): AsyncGenerator<unknown, void, unknown> {
  const stream = ensureAsyncIterable(streamLike);
  const decoder = new Decoder(options);
  return decoder.decodeArrayStream(stream);
}

/**
 * @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
 * @throws {@link DecodeError} if the buffer contains invalid data.
 */
export function decodeMultiStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>,
  options?: DecoderOptions<SplitUndefined<ContextType>>,
): AsyncGenerator<unknown, void, unknown> {
  const stream = ensureAsyncIterable(streamLike);
  const decoder = new Decoder(options);
  return decoder.decodeStream(stream);
}
