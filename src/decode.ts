import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { createDataView } from "./utils/typedArrays";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;
  }>
>;

export function decode(buffer: ReadonlyArray<number> | Uint8Array, options: DecodeOptions = {}): unknown {
  const view = createDataView(buffer);

  const context = new Decoder(view, options.extensionCodec || ExtensionCodec.defaultCodec);
  return context.decode();
}
