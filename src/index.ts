// Main Functions:

export { encode } from "./encode";
export type { EncodeOptions } from "./encode";

export { decode, decodeMulti } from "./decode";
export type { DecodeOptions } from "./decode";

export { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream } from "./decodeAsync";

export { Decoder, DataViewIndexOutOfBoundsError } from "./Decoder";
export type { DecoderOptions } from "./Decoder";
export { DecodeError } from "./DecodeError";

export { Encoder } from "./Encoder";
export type { EncoderOptions } from "./Encoder";

// Utilities for Extension Types:

export { ExtensionCodec } from "./ExtensionCodec";
export type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType } from "./ExtensionCodec";
export { ExtData } from "./ExtData";

export {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
} from "./timestamp";
