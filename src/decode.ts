import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { BufferType } from "./BufferType";
import { ensureArrayBuffer } from "./utils/ensureArrayBuffer";

export type DecodeOptions = Partial<Readonly<{
  extensionCodec: ExtensionCodecType;
}>>;

export function decode(buffer: BufferType, options: DecodeOptions = {}): unknown {
  const arrayBuffer = ensureArrayBuffer(buffer);
  const view = new DataView(arrayBuffer);

  const context = new Decoder(view, options.extensionCodec || ExtensionCodec.defaultCodec);
  return context.decode();
}
