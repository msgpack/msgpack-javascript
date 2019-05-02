import { prettyByte } from "./prettyByte";

// USE_TEXT_ENOCDER is opt-in because NodeJS v12's impl is much slower than pure-JavaScript version (i.e. _utf8Encode).
// Set `USE_TEXT_ENOCDER=true` to use TextEncoder.
const USE_TEXT_ENCODER = (process.env.USE_TEXT_ENOCDER === 'true' && typeof TextEncoder !== "undefined");

function _utf8Encode(str: string): ReadonlyArray<number> {
  const len = str.length;

  const bytes: Array<number> = [];

  let pos = 0;
  while (pos < len) {
    let value = str.charCodeAt(pos++);
    if (value >= 0xd800 && value <= 0xdbff) {
      // high surrogate
      if (pos < len) {
        const extra = str.charCodeAt(pos);
        if ((extra & 0xfc00) === 0xdc00) {
          ++pos;
          value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
        }
      }
      if (value >= 0xd800 && value <= 0xdbff) {
        continue;  // drop lone surrogate
      }
    }

    if ((value & 0xffffff80) === 0) {  // 1-byte
      bytes.push(value);
      continue;
    } else if ((value & 0xfffff800) === 0) {  // 2-bytes
      bytes.push(((value >>  6) & 0x1f) | 0xc0)
    } else if ((value & 0xffff0000) === 0) {  // 3-byte
      bytes.push(((value >> 12) & 0x0f) | 0xe0);
      bytes.push(((value >>  6) & 0x3f) | 0x80);
    } else if ((value & 0xffe00000) === 0) {  // 4-byte
      bytes.push(((value >> 18) & 0x07) | 0xf0);
      bytes.push(((value >> 12) & 0x3f) | 0x80);
      bytes.push(((value >>  6) & 0x3f) | 0x80);
    } else {
      throw new Error(`Invalid UTF-8 byte in encode: ${prettyByte(value)} at ${pos}`);
    }

    bytes.push((value & 0x3f) | 0x80);
  }

  return bytes;
}

function createUtf8Encode() {
  if (USE_TEXT_ENCODER) {
    const encoder = new TextEncoder();

    return (str: string): ReadonlyArray<number> => {
      // convert to array to avoid --downlevelIteration on the caller
      return Array.from(encoder.encode(str));
    };
  } else {
    return _utf8Encode;
  }
}

export const utf8Encode = createUtf8Encode();
