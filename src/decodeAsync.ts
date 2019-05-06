import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { AsyncDecoder } from "./AsyncDecoder";

type DecodeAsyncOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export async function decodeAsync(
  buffers: AsyncIterable<Uint8Array | ArrayLike<number>>,
  options: DecodeAsyncOptions = {},
): Promise<unknown> {
  const asyncDecoder = new AsyncDecoder(buffers, options.extensionCodec || ExtensionCodec.defaultCodec);
  return await asyncDecoder.decode();
}
