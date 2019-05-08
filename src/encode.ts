import { ExtensionCodecType } from "./ExtensionCodec";
import { Encoder } from "./Encoder";

export type EncodeOptions = Partial<
  Readonly<{
    maxDepth: number;
    initialBufferSize: number;
    extensionCodec: ExtensionCodecType;
  }>
>;

export function encode(
  value: unknown,
  { extensionCodec, maxDepth, initialBufferSize }: EncodeOptions = {},
): Uint8Array {
  const encoder = new Encoder(extensionCodec, maxDepth, initialBufferSize);
  encoder.encode(value, 1);
  return encoder.getUint8Array();
}
