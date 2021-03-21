// Main Functions:

import { encode } from "./encode";
export { encode };
import type { EncodeOptions } from "./encode";
export type { EncodeOptions };

import { decode, decodeMulti } from "./decode";
export { decode, decodeMulti };
import type { DecodeOptions } from "./decode";
export { DecodeOptions };

import { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream } from "./decodeAsync";
export { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream };

import { Decoder, DecodeError } from "./Decoder";
export { Decoder, DecodeError };

import { Encoder } from "./Encoder";
export { Encoder };

// Utilitiies for Extension Types:

import { ExtensionCodec } from "./ExtensionCodec";
export { ExtensionCodec };
import type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType } from "./ExtensionCodec";
export type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType };
import { ExtData } from "./ExtData";
export { ExtData };

import {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
} from "./timestamp";
export {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
};
