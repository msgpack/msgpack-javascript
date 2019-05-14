import { ExtensionCodecType } from "./ExtensionCodec";
import { Encoder } from "./Encoder";

export type EncodeOptions = Partial<
  Readonly<{
    maxDepth: number;
    initialBufferSize: number;
    extensionCodec: ExtensionCodecType;
  }>
>;

export function encode(value: unknown, options?: EncodeOptions): Uint8Array {
  const encoder = new Encoder(
    options && options.extensionCodec,
    options && options.maxDepth,
    options && options.initialBufferSize,
  );
  encoder.encode(value, 1);
  return encoder.getUint8Array();
}
