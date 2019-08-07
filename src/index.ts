// Main Functions:

export { encode } from "./encode";
export { decode } from "./decode";
export { decodeAsync, decodeArrayStream, decodeStream } from "./decodeAsync";

/**
 * @experimental `Decoder` is exported for experimental use.
 */
export { Decoder } from "./Decoder";

/**
 * @experimental `Encoder` is exported for experimental use.
 */
export { Encoder } from "./Encoder";

// Utilitiies for Extension Types:

export { ExtensionCodec, ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType } from "./ExtensionCodec";
export { ExtData } from "./ExtData";
export {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
} from "./timestamp";

/**
 * @experimental WebAssembly backend is experimenal.
 */
export { WASM_AVAILABLE as __WASM_AVAILABLE } from "./wasmFunctions";
