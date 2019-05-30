import { Decoder } from "./Decoder";
import { defaultDecodeOptions, DecodeOptions } from "./decode";
import { ensureAsyncIterabe, ReadableStreamLike } from "./utils/stream";

export type DecodeAsyncOptions = DecodeOptions;
export const defaultDecodeAsyncOptions = defaultDecodeOptions;

export async function decodeAsync(
  streamLike: ReadableStreamLike<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
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
  return decoder.decodeOneAsync(stream);
}

export function decodeArrayStream(
  streamLike: ReadableStreamLike<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
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
  streamLike: ReadableStreamLike<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
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
