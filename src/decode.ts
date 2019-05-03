import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { BufferType } from "./BufferType";
import { createDataView } from "./utils/typedArrays";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export function decode(buffer: BufferType, options: DecodeOptions = {}): unknown {
  const view = createDataView(buffer);

  const context = new Decoder(view, options.extensionCodec || ExtensionCodec.defaultCodec);
  return context.decode();
}
