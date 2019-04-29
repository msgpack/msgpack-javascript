import { BufferType } from "../BufferType";
import { prettyByte } from "./prettyByte";

const USE_NATIVE_TEXT_DECODER = typeof TextDecoder !== "undefined";

function _utf8Decode(buffer: BufferType): string {
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;
  const out: Array<number> = [];

  let pos = 0;
  while (pos < len) {
    const byte1 = bytes[pos++];
    if (byte1 === 0) {
      break; // NULL
    }

    if ((byte1 & 0x80) === 0) {
      // 1 byte
      out.push(byte1);
    } else if ((byte1 & 0xe0) === 0xc0) {
      // 2 bytes
      const byte2 = bytes[pos++] & 0x3f;
      out.push(((byte1 & 0x1f) << 6) | byte2);
    } else if ((byte1 & 0xf0) === 0xe0) {
      // 3 bytes
      const byte2 = bytes[pos++] & 0x3f;
      const byte3 = bytes[pos++] & 0x3f;
      out.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
    } else if ((byte1 & 0xf8) === 0xf0) {
      // 4 bytes
      const byte2 = bytes[pos++] & 0x3f;
      const byte3 = bytes[pos++] & 0x3f;
      const byte4 = bytes[pos++] & 0x3f;

      let codepoint =
        ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (codepoint > 0xffff) {
        codepoint -= 0x10000;
        out.push(((codepoint >>> 10) & 0x3ff) | 0xd800);
        codepoint = 0xdc00 | (codepoint & 0x3ff);
      }
      out.push(codepoint);
    } else {
      throw new Error(`Invalid UTF-8 byte ${prettyByte(byte1)} at ${pos}`);
    }
  }

  return String.fromCharCode(...out);
}

function createNativeUtf8Decode() {
  const decoder = new TextDecoder();

  return (buffer: BufferType): string => {
    const arrayBuffer = new Uint8Array(buffer);
    return decoder.decode(arrayBuffer);
  };
}

export const utf8Decode: typeof _utf8Decode = USE_NATIVE_TEXT_DECODER ? createNativeUtf8Decode() :  _utf8Decode;
