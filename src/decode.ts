import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export function decode(buffer: ReadonlyArray<number> | Uint8Array, options: DecodeOptions = {}): unknown {
  const decoder = new Decoder(options.extensionCodec || ExtensionCodec.defaultCodec);
  decoder.setBuffer(buffer); // decodeSync() requires only one buffer
  return decoder.decodeOneSync();
}
