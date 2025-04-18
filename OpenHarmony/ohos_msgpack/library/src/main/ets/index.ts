// Main Functions:

import { encode } from "./encode";
export { encode };
import type { EncodeOptions } from "./encode";
export type { EncodeOptions };

import { decode, decodeMulti } from "./decode";
export { decode, decodeMulti };
import type { DecodeOptions } from "./decode";
export type { DecodeOptions };

import { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream } from "./decodeAsync";
export { decodeAsync, decodeArrayStream, decodeMultiStream, decodeStream };

import { Decoder, DataViewIndexOutOfBoundsError } from "./Decoder";
export { Decoder, DataViewIndexOutOfBoundsError };
import type { DecoderOptions } from "./Decoder";
export type { DecoderOptions };
import { DecodeError } from "./DecodeError";
export { DecodeError };

import { Encoder } from "./Encoder";
export { Encoder };
import type { EncoderOptions } from "./Encoder";
export type { EncoderOptions };

// Utilities for Extension Types:

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
  TimeSpec,
} from "./timestamp";
import { getInt64, getUint64, setInt64, setUint64 } from './utils/int';
import { utf8Count, utf8EncodeJs } from './utils/utf8';
import { CachedKeyDecoder, KeyDecoder } from './CachedKeyDecoder';

export {
  EXT_TIMESTAMP,
  encodeDateToTimeSpec,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
  decodeTimestampExtension,
  setInt64, getInt64, getUint64, setUint64,
  utf8Count, utf8EncodeJs, CachedKeyDecoder, KeyDecoder,
  TimeSpec,
};
