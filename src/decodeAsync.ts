import { Decoder } from "./Decoder";
import { defaultDecodeOptions, DecodeOptions } from "./decode";

export type DecodeAsyncOptions = DecodeOptions;
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

export async function* decodeArrayStream(
  stream: AsyncIterable<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = defaultDecodeOptions,
) {
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
