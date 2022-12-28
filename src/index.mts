// Main Functions:

import { encode } from "./encode.mjs";
export { encode };
import type { EncodeOptions } from "./encode.mjs";
export type { EncodeOptions };

import { decode, decodeMulti } from "./decode.mjs";
export { decode, decodeMulti };
import type { DecodeOptions } from "./decode.mjs";
export { DecodeOptions };

import { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream } from "./decodeAsync.mjs";
export { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream };

import { Decoder, DataViewIndexOutOfBoundsError } from "./Decoder.mjs";
import { DecodeError } from "./DecodeError.mjs";
export { Decoder, DecodeError, DataViewIndexOutOfBoundsError };

import { Encoder } from "./Encoder.mjs";
export { Encoder };

// Utilitiies for Extension Types:

import { ExtensionCodec } from "./ExtensionCodec.mjs";
export { ExtensionCodec };
import type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType } from "./ExtensionCodec.mjs";
export type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType };
import { ExtData } from "./ExtData.mjs";
export { ExtData };

import {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
} from "./timestamp.mjs";
export {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
};
