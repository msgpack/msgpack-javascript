import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { BufferType } from "./BufferType";

export type DecodeOptions = Readonly<{
  extensionCodec: ExtensionCodecType;
}>;

export function decode(blob: BufferType, options: Partial<DecodeOptions> = {}): unknown {
  const context = new Decoder(blob, options.extensionCodec || ExtensionCodec.defaultCodec);
  return context.decode();
}
