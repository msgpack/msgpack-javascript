import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder } from "./Decoder";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export function decode(buffer: ReadonlyArray<number> | Uint8Array, { extensionCodec }: DecodeOptions = {}): unknown {
  const decoder = new Decoder(extensionCodec);
  decoder.setBuffer(buffer); // decodeSync() requires only one buffer
  return decoder.decodeOneSync();
}
