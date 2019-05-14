import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder } from "./Decoder";

type DecodeAsyncOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export async function decodeAsync(
  stream: AsyncIterable<Uint8Array | ArrayLike<number>>,
  options?: DecodeAsyncOptions,
): Promise<unknown> {
  const decoder = new Decoder(options && options.extensionCodec);
  return decoder.decodeOneAsync(stream);
}
