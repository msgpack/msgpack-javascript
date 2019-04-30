import { prettyByte } from "./utils/prettyByte";

export type InputBufferType = ReadonlyArray<number> | Uint8Array;

export function decode(blob: InputBufferType): unknown {
  const context = new DecodeContext(blob);
  return context.decode();
}

class DecodeContext {
  readonly buffer: InputBufferType;
  pos = 0;

  constructor(buffer: InputBufferType) {
    this.buffer = buffer;
  }

  decode() {
    const type = this.next8();

    if (type >= 0xe0) {
      // negative fixint (111x xxxx) 0xe0 - 0xff
      return type - 0x100;
    } else if (type < 0xc0) {
      if (type < 0x80) {
        // positive fixint (0xxx xxxx) 0x00 - 0x7f
        return type;
      } else if (type < 0x90) {
        // fixmap (1000 xxxx) 0x80 - 0x8f
        const size = type - 0x80;
        return this.decodeMap(size);
      } else if (type < 0xa0) {
        // fixarray (1001 xxxx) 0x90 - 0x9f
        const size = type - 0x90;
        return this.decodeArray(size);
      } else {
        // fixstr (101x xxxx) 0xa0 - 0xbf
        const length = type - 0xa0;
        return this.decodeUtf8String(length);
      }
    }

    if (type === 0xc0) {
      // nil
      return null;
    } else if (type === 0xc2) {
      // false
      return false;
    } else if (type === 0xc3) {
      // true
      return true;
    } else if (type === 0xc4) {
      // bin 8
      const size = this.next8();
      return this.decodeBinary(size);
    } else if (type === 0xc5) {
      // bin 16
      const size = this.next16();
      return this.decodeBinary(size);
    } else if (type === 0xc6) {
      // bin 32
      const size = this.next32();
      return this.decodeBinary(size);
    } else if (type === 0xca) {
      // float 32
      return this.decodeFloat(23, 4);
    } else if (type === 0xcb) {
      // float 64
      return this.decodeFloat(52, 8);
    } else if (type === 0xcc) {
      // uint 8
      return this.next8();
    } else if (type === 0xcd) {
      // uint 16
      return this.next16();
    } else if (type === 0xce) {
      // uint 32
      return this.next32();
    } else if (type === 0xcf) {
      // uint 64
      return this.next64();
    } else if (type === 0xd0) {
      // int 8
      const v = this.next8();
      return v < 0x80 ? v : v - 0x100;
    } else if (type === 0xd1) {
      // int 16
      const v = this.next16();
      return v < 0x8000 ? v : v - 0x10000;
    } else if (type === 0xd2) {
      // int 32
      const v = this.next32();
      return v < 0x80000000 ? v : v - 0x100000000;
    } else if (type === 0xd3) {
      // int 64
      const b1 = this.next8();
      const b2 = this.next8();
      const b3 = this.next8();
      const b4 = this.next8();
      const b5 = this.next8();
      const b6 = this.next8();
      const b7 = this.next8();
      const b8 = this.next8();

      if (b1 & 0x80) {
        // to avoid overflow
        return -(
          (b1 ^ 0xff) * 0x100000000000000 +
          (b2 ^ 0xff) * 0x1000000000000 +
          (b3 ^ 0xff) * 0x10000000000 +
          (b4 ^ 0xff) * 0x100000000 +
          (b5 ^ 0xff) * 0x1000000 +
          (b6 ^ 0xff) * 0x10000 +
          (b7 ^ 0xff) * 0x100 +
          (b8 ^ 0xff) +
          1
        );
      }
      return (
        b1 * 0x100000000000000 +
        b2 * 0x1000000000000 +
        b3 * 0x10000000000 +
        b4 * 0x100000000 +
        b5 * 0x1000000 +
        b6 * 0x10000 +
        b7 * 0x100 +
        b8
      );
    } else if (type === 0xd9) {
      // str 8
      const length = this.next8();
      return this.decodeUtf8String(length);
    } else if (type === 0xda) {
      // str 16
      const length = this.next16();
      return this.decodeUtf8String(length);
    } else if (type === 0xdb) {
      // str 32
      const length = this.next32();
      return this.decodeUtf8String(length);
    } else if (type === 0xdc) {
      // array 16
      const size = this.next16();
      return this.decodeArray(size);
    } else if (type === 0xdd) {
      // array 32
      const size = this.next32();
      return this.decodeArray(size);
    } else if (type === 0xde) {
      // map 16
      const size = this.next16();
      return this.decodeMap(size);
    } else if (type === 0xdf) {
      // map 32
      const size = this.next32();
      return this.decodeMap(size);
    }
  }

  decodeBinary(size: number): ArrayLike<number> {
    const start = this.pos;
    this.pos += size;
    return this.buffer.slice(start, start + size);
  }

  decodeFloat(mLen: number, nBytes: number): number {
    const eLen = nBytes * 8 - mLen - 1;
    const eMax = (1 << eLen) - 1;
    const eBias = eMax >> 1;
    let nBits = -7;
    const byte = this.next8();
    const sign = byte >> -nBits;
    let exp = byte & ((1 << -nBits) - 1);

    nBits += eLen;
    while (nBits > 0) {
      exp = exp * 256 + this.next8();
      nBits -= 8;
    }

    let frac = exp & ((1 << -nBits) - 1);
    exp >>= -nBits;
    nBits += mLen;

    while (nBits > 0) {
      frac = frac * 256 + this.next8();
      nBits -= 8;
    }

    if (exp === 0) {
      exp = 1 - eBias;
    } else if (exp === eMax) {
      return frac ? NaN : sign ? -Infinity : Infinity;
    } else {
      frac = frac + Math.pow(2, mLen);
      exp = exp - eBias;
    }
    const value = frac * Math.pow(2, exp - mLen);
    return sign ? -value : value;
  }

  decodeUtf8String(length: number): string {
    const out: Array<number> = [];

    const end = this.pos + length;
    while (this.pos < end) {
      const byte1 = this.next8();

      if (byte1 == null) {
        throw new Error(`Invalid null at ${this.pos} in decoding ${length} bytes of buffer`);
      }

      if ((byte1 & 0x80) === 0) {
        // 1 byte
        out.push(byte1);
      } else if ((byte1 & 0xe0) === 0xc0) {
        // 2 bytes
        const byte2 = this.next8() & 0x3f;
        out.push(((byte1 & 0x1f) << 6) | byte2);
      } else if ((byte1 & 0xf0) === 0xe0) {
        // 3 bytes
        const byte2 = this.next8() & 0x3f;
        const byte3 = this.next8() & 0x3f;
        out.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
      } else if ((byte1 & 0xf8) === 0xf0) {
        // 4 bytes
        const byte2 = this.next8() & 0x3f;
        const byte3 = this.next8() & 0x3f;
        const byte4 = this.next8() & 0x3f;

        let codepoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
        if (codepoint > 0xffff) {
          codepoint -= 0x10000;
          out.push(((codepoint >>> 10) & 0x3ff) | 0xd800);
          codepoint = 0xdc00 | (codepoint & 0x3ff);
        }
        out.push(codepoint);
      } else {
        throw new Error(`Invalid UTF-8 byte ${prettyByte(byte1)} at ${this.pos}`);
      }
    }

    return String.fromCharCode(...out);
  }

  decodeMap(size: number): Record<string, any> {
    const result: Record<string, any> = {};
    for (let i = 0; i < size; i++) {
      const key = this.decode();
      if (typeof key !== "string") {
        throw new Error(`Unsupported map key type: ${typeof key}`);
      }
      const value = this.decode();
      result[key] = value;
    }
    return result;
  }

  decodeArray(size: number): Array<any> {
    const result = new Array<any>(size);
    for (let i = 0; i < size; i++) {
      result[i] = this.decode();
    }
    return result;
  }

  next8(): number {
    return this.buffer[this.pos++];
  }

  next16(): number {
    const b1 = this.next8();
    const b2 = this.next8();
    return (b1 << 8) + b2;
  }

  next32(): number {
    const b1 = this.next8();
    const b2 = this.next8();
    const b3 = this.next8();
    const b4 = this.next8();
    return b1 * 0x1000000 + (b2 << 16) + (b3 << 8) + b4;
  }

  next64(): number {
    const high = this.next32();
    const low = this.next32();

    return high * 0x100000000 + low;
  }
}
