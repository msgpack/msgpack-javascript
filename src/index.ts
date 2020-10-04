// Main Functions:

import { encode } from "./encode";
export { encode };
import type { EncodeOptions } from "./encode";
export type { EncodeOptions };

import { decode } from "./decode";
export { decode };
import type { DecodeOptions } from "./decode";
export { DecodeOptions };

import { decodeAsync, decodeArrayStream, decodeStream } from "./decodeAsync";
export { decodeAsync, decodeArrayStream, decodeStream };

import { Decoder } from "./Decoder";
export { Decoder };

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
