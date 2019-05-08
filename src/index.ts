export { encode } from "./encode";
export { decode } from "./decode";
export { decodeAsync } from "./decodeAsync";

// Utilitiies for extensions
export {
  ExtensionCodec,
  ExtensionCodecType,
  ExtensionDecoderType,
  ExtensionEncoderType,
  EXT_TIMESTAMP,
  encodeTimestampExtension,
  encodeTimestampFromTimeSpec,
  decodeTimestampExtension,
} from "./ExtensionCodec";

export { ExtData } from "./ExtData";
