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

export async function* decodeArrayStream(
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

  for await (let item of decoder.decodeArrayStream(stream)) {
    yield item;
  }
}
