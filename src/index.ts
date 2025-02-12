// Main Functions:

import { encode } from "./encode.ts";
export { encode };

import { decode, decodeMulti } from "./decode.ts";
export { decode, decodeMulti };

import { decodeAsync, decodeArrayStream, decodeMultiStream } from "./decodeAsync.ts";
export { decodeAsync, decodeArrayStream, decodeMultiStream };

import { Decoder } from "./Decoder.ts";
export { Decoder };
import type { DecoderOptions } from "./Decoder.ts";
export type { DecoderOptions };
import { DecodeError } from "./DecodeError.ts";
export { DecodeError };

import { Encoder } from "./Encoder.ts";
export { Encoder };
import type { EncoderOptions } from "./Encoder.ts";
export type { EncoderOptions };

// Utilities for Extension Types:

import { ExtensionCodec } from "./ExtensionCodec.ts";
export { ExtensionCodec };
import type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType } from "./ExtensionCodec.ts";
export type { ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType };
import { ExtData } from "./ExtData.ts";
export { ExtData };

import {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
} from "./timestamp.ts";
export {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
};
