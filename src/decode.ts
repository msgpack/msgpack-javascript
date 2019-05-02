import { ExtensionCodecType, ExtensionCodec } from "./ExtensionCodec";
import { Decoder } from "./Decoder";
import { BufferType } from "./BufferType";
import { isNodeJsBuffer } from "./utils/is";

export type DecodeOptions = Readonly<{
  extensionCodec: ExtensionCodecType;
}>;

export function decode(blob: BufferType, options: Partial<DecodeOptions> = {}): unknown {
  const buffer =
    ArrayBuffer.isView(blob) && !isNodeJsBuffer(blob)
      ? // buffer is Uint8Array (or any other typed arrays)
        blob.buffer
      : // buffer is ReadonlyArray<number> or NodeJS's Buffer
        new Uint8Array(blob).buffer;
  const view = new DataView(buffer);

  const context = new Decoder(view, options.extensionCodec || ExtensionCodec.defaultCodec);
  return context.decode();
}
