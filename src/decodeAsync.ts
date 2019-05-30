import { Decoder } from "./Decoder";
import { defaultDecodeOptions, DecodeOptions } from "./decode";
import { isReadableStream, asyncIterableFromStream } from "./utils/stream";

export type DecodeAsyncOptions = DecodeOptions;
export const defaultDecodeAsyncOptions = defaultDecodeOptions;

type StreamLike<T> = AsyncIterable<T> | ReadableStream<T>;

export async function decodeAsync(
  streamLike: StreamLike<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
): Promise<unknown> {
  const stream = isReadableStream(streamLike) ? asyncIterableFromStream(streamLike) : streamLike;

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
  streamLike: StreamLike<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
) {
  const stream = isReadableStream(streamLike) ? asyncIterableFromStream(streamLike) : streamLike;

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
