import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";

type DecodeAsyncOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export async function decodeAsync(
  buffers: AsyncIterable<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = {},
): Promise<unknown> {
  const decoder = new Decoder(options.extensionCodec || ExtensionCodec.defaultCodec);
  return await decoder.decodeAsync(buffers);
}
