import { Decoder } from "./Decoder";
import { defaultDecodeOptions, DecodeOptions } from "./decode";
import { ensureAsyncIterabe, ReadableStreamLike } from "./utils/stream";

export async function decodeAsync(
  streamLike: ReadableStreamLike<ArrayLike<number>>,
  options: DecodeOptions = defaultDecodeOptions,
): Promise<unknown> {
  const stream = ensureAsyncIterabe(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );
  return decoder.decodeSingleAsync(stream);
}

export function decodeArrayStream(
  streamLike: ReadableStreamLike<ArrayLike<number>>,
  options: DecodeOptions = defaultDecodeOptions,
) {
  const stream = ensureAsyncIterabe(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );

  return decoder.decodeArrayStream(stream);
}

export function decodeStream(
  streamLike: ReadableStreamLike<ArrayLike<number>>,
  options: DecodeOptions = defaultDecodeOptions,
) {
  const stream = ensureAsyncIterabe(streamLike);

  const decoder = new Decoder(
    options.extensionCodec,
    options.maxStrLength,
    options.maxBinLength,
    options.maxArrayLength,
    options.maxMapLength,
    options.maxExtLength,
  );

  return decoder.decodeStream(stream);
}
