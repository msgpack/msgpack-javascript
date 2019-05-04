export { encode } from "./encode";
export { decode } from "./decode";

// Utilitiies for extensions
export {
  ExtensionCodec,
  ExtensionCodecType,
  ExtensionDecoderType,
  ExtensionEncoderType,
  ExtDataType,
  EXT_TIMESTAMP,
  encodeTimestampExtension,
  encodeTimestampFromTimeSpec,
  decodeTimestampExtension,
} from "./ExtensionCodec";
