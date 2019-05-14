import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder } from "./Decoder";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export function decode(buffer: ReadonlyArray<number> | Uint8Array, options?: DecodeOptions): unknown {
  const decoder = new Decoder(options && options.extensionCodec);
  decoder.setBuffer(buffer); // decodeSync() requires only one buffer
  return decoder.decodeOneSync();
}
