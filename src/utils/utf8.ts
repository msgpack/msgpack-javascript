import { WASM_AVAILABLE, utf8CountWasm, utf8EncodeWasm, utf8DecodeWasm } from "./utf8-wasm.ts";

export { WASM_AVAILABLE };

export function utf8CountJs(str: string): number {
  const strLength = str.length;

  let byteLength = 0;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);

    if ((value & 0xffffff80) === 0) {
      // 1-byte
      byteLength++;
      continue;
    } else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      byteLength += 2;
    } else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
        // high surrogate
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 0xfc00) === 0xdc00) {
            ++pos;
            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
          }
        }
      }

      if ((value & 0xffff0000) === 0) {
        // 3-byte
        byteLength += 3;
      } else {
        // 4-byte
        byteLength += 4;
      }
    }
  }
  return byteLength;
}

export const utf8Count: (str: string) => number = WASM_AVAILABLE ? utf8CountWasm : utf8CountJs;

export function utf8EncodeJs(str: string, output: Uint8Array, outputOffset: number): void {
  const strLength = str.length;
  let offset = outputOffset;
  let pos = 0;
  while (pos < strLength) {
    let value = str.charCodeAt(pos++);

    if ((value & 0xffffff80) === 0) {
      // 1-byte
      output[offset++] = value;
      continue;
    } else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      output[offset++] = ((value >> 6) & 0x1f) | 0xc0;
    } else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
        // high surrogate
        if (pos < strLength) {
          const extra = str.charCodeAt(pos);
          if ((extra & 0xfc00) === 0xdc00) {
            ++pos;
            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
          }
        }
      }

      if ((value & 0xffff0000) === 0) {
        // 3-byte
        output[offset++] = ((value >> 12) & 0x0f) | 0xe0;
        output[offset++] = ((value >> 6) & 0x3f) | 0x80;
      } else {
        // 4-byte
        output[offset++] = ((value >> 18) & 0x07) | 0xf0;
        output[offset++] = ((value >> 12) & 0x3f) | 0x80;
        output[offset++] = ((value >> 6) & 0x3f) | 0x80;
      }
    }

    output[offset++] = (value & 0x3f) | 0x80;
  }
}

// TextEncoder and TextDecoder are standardized in whatwg encoding:
// https://encoding.spec.whatwg.org/
// and available in all the modern browsers:
// https://caniuse.com/textencoder
// They are available in Node.js since v12 LTS as well:
// https://nodejs.org/api/globals.html#textencoder

const sharedTextEncoder = new TextEncoder();

// This threshold should be determined by benchmarking, which might vary in engines and input data.
// Run `npx ts-node benchmark/encode-string.ts` for details.
// For mixed content (ASCII + CJK + emoji), JS wins for strLength < 30-50.
// After that, WASM or TextEncoder is faster depending on content type.
const TEXT_ENCODER_THRESHOLD = 50;

export function utf8EncodeTE(str: string, output: Uint8Array, outputOffset: number): void {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}

// Wasm threshold: use wasm for medium strings, TextEncoder for large strings.
// For pure ASCII, TextEncoder is ~1.7x faster at 100+ strLength.
// For CJK/emoji, WASM is ~1.4-1.6x faster than TextEncoder at all sizes.
// 1000 is a compromise for mixed content.
const WASM_ENCODE_MAX = 1000;

function utf8EncodeWithWasm(str: string, output: Uint8Array, outputOffset: number): void {
  const len = str.length;
  if (len > WASM_ENCODE_MAX) {
    utf8EncodeTE(str, output, outputOffset);
  } else if (len > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeWasm(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}

function utf8EncodeNoWasm(str: string, output: Uint8Array, outputOffset: number): void {
  if (str.length > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeTE(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}

export const utf8Encode: (str: string, output: Uint8Array, outputOffset: number) => void = WASM_AVAILABLE
  ? utf8EncodeWithWasm
  : utf8EncodeNoWasm;

const CHUNK_SIZE = 0x1_000;

export function utf8DecodeJs(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  let offset = inputOffset;
  const end = offset + byteLength;

  const units: Array<number> = [];
  let result = "";
  while (offset < end) {
    const byte1 = bytes[offset++]!;
    if ((byte1 & 0x80) === 0) {
      // 1 byte
      units.push(byte1);
    } else if ((byte1 & 0xe0) === 0xc0) {
      // 2 bytes
      const byte2 = bytes[offset++]! & 0x3f;
      units.push(((byte1 & 0x1f) << 6) | byte2);
    } else if ((byte1 & 0xf0) === 0xe0) {
      // 3 bytes
      const byte2 = bytes[offset++]! & 0x3f;
      const byte3 = bytes[offset++]! & 0x3f;
      units.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
    } else if ((byte1 & 0xf8) === 0xf0) {
      // 4 bytes
      const byte2 = bytes[offset++]! & 0x3f;
      const byte3 = bytes[offset++]! & 0x3f;
      const byte4 = bytes[offset++]! & 0x3f;
      let unit = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (unit > 0xffff) {
        unit -= 0x10000;
        units.push(((unit >>> 10) & 0x3ff) | 0xd800);
        unit = 0xdc00 | (unit & 0x3ff);
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }

    if (units.length >= CHUNK_SIZE) {
      result += String.fromCharCode(...units);
      units.length = 0;
    }
  }

  if (units.length > 0) {
    result += String.fromCharCode(...units);
  }

  return result;
}

const sharedTextDecoder = new TextDecoder();

// This threshold should be determined by benchmarking, which might vary in engines and input data.
// Run `npx ts-node benchmark/decode-string.ts` for details.
// For mixed content (ASCII + CJK + emoji), JS wins for very short strings only.
// WASM becomes superior at ~30-50 bytes for non-ASCII content.
const TEXT_DECODER_THRESHOLD = 50;

export function utf8DecodeTD(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}

// Wasm decode threshold: use wasm for medium strings, TextDecoder for large strings.
// For pure ASCII, TextDecoder is ~5x faster at 1000+ bytes.
// For CJK/emoji, WASM is ~5-6x faster than TextDecoder at all sizes.
// 1000 is a compromise for mixed content.
const WASM_DECODE_MAX = 1000;

function utf8DecodeWithWasm(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  if (byteLength > WASM_DECODE_MAX) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeWasm(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}

function utf8DecodeNoWasm(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}

export const utf8Decode: (bytes: Uint8Array, inputOffset: number, byteLength: number) => string = WASM_AVAILABLE
  ? utf8DecodeWithWasm
  : utf8DecodeNoWasm;
