import { Decoder } from "./Decoder";
import { defaultDecodeOptions, DecodeOptions } from "./decode";
import { ensureAsyncIterable, ReadableStreamLike } from "./utils/stream";
import { SplitUndefined } from "./context";

export async function decodeAsync<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number>>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
): Promise<unknown> {
  const stream = ensureAsyncIterable(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );
  return decoder.decodeAsync(stream);
}

export function decodeArrayStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number>>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
) {
  const stream = ensureAsyncIterable(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );

  return decoder.decodeArrayStream(stream);
}

export function decodeStream<ContextType>(
  streamLike: ReadableStreamLike<ArrayLike<number>>,
  options: DecodeOptions<SplitUndefined<ContextType>> = defaultDecodeOptions as any,
) {
  const stream = ensureAsyncIterable(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    (options as typeof options & { context: any }).context,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );

  return decoder.decodeStream(stream);
}
