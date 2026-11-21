export function utf8Count(str: string): number {
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
const TEXT_ENCODER_THRESHOLD = 50;

export function utf8EncodeTE(str: string, output: Uint8Array, outputOffset: number): void {
  sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}

export function utf8Encode(str: string, output: Uint8Array, outputOffset: number): void {
  if (str.length > TEXT_ENCODER_THRESHOLD) {
    utf8EncodeTE(str, output, outputOffset);
  } else {
    utf8EncodeJs(str, output, outputOffset);
  }
}

const CHUNK_SIZE = 0x1_000;

// Decodes UTF-8 like TextDecoder (WHATWG Encoding Standard): an ill-formed
// sequence becomes one U+FFFD per maximal subpart, and a sequence is never
// read past `inputOffset + byteLength`.
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
    } else if (byte1 >= 0xc2 && byte1 <= 0xdf) {
      // 2 bytes
      const byte2 = offset < end ? bytes[offset]! : 0;
      if ((byte2 & 0xc0) === 0x80) {
        offset++;
        units.push(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
      } else {
        units.push(0xfffd);
      }
    } else if (byte1 >= 0xe0 && byte1 <= 0xef) {
      // 3 bytes; E0 and ED narrow the second byte to reject overlongs and surrogates
      const byte2 = offset < end ? bytes[offset]! : 0;
      const lower = byte1 === 0xe0 ? 0xa0 : 0x80;
      const upper = byte1 === 0xed ? 0x9f : 0xbf;
      if (byte2 >= lower && byte2 <= upper) {
        offset++;
        const byte3 = offset < end ? bytes[offset]! : 0;
        if ((byte3 & 0xc0) === 0x80) {
          offset++;
          units.push(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
        } else {
          units.push(0xfffd);
        }
      } else {
        units.push(0xfffd);
      }
    } else if (byte1 >= 0xf0 && byte1 <= 0xf4) {
      // 4 bytes; F0 and F4 narrow the second byte to reject overlongs and values above U+10FFFF
      const byte2 = offset < end ? bytes[offset]! : 0;
      const lower = byte1 === 0xf0 ? 0x90 : 0x80;
      const upper = byte1 === 0xf4 ? 0x8f : 0xbf;
      if (byte2 >= lower && byte2 <= upper) {
        offset++;
        const byte3 = offset < end ? bytes[offset]! : 0;
        if ((byte3 & 0xc0) === 0x80) {
          offset++;
          const byte4 = offset < end ? bytes[offset]! : 0;
          if ((byte4 & 0xc0) === 0x80) {
            offset++;
            const unit =
              (((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f)) - 0x10000;
            units.push(((unit >>> 10) & 0x3ff) | 0xd800, 0xdc00 | (unit & 0x3ff));
          } else {
            units.push(0xfffd);
          }
        } else {
          units.push(0xfffd);
        }
      } else {
        units.push(0xfffd);
      }
    } else {
      // continuation byte without a lead byte, C0, C1 or F5..FF
      units.push(0xfffd);
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
const TEXT_DECODER_THRESHOLD = 200;

export function utf8DecodeTD(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
  return sharedTextDecoder.decode(stringBytes);
}

export function utf8Decode(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  if (byteLength > TEXT_DECODER_THRESHOLD) {
    return utf8DecodeTD(bytes, inputOffset, byteLength);
  } else {
    return utf8DecodeJs(bytes, inputOffset, byteLength);
  }
}
