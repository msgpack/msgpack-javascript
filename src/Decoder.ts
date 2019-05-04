import { prettyByte } from "./utils/prettyByte";
import { ExtensionCodecType } from "./ExtensionCodec";
import { decodeInt64 } from "./utils/int";
import { utf8Decode } from "./utils/utf8";

export class Decoder {
  pos = 0;
  constructor(readonly view: DataView, readonly extensionCodec: ExtensionCodecType) {}

  decode() {
    const type = this.readU8();
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
        const byteLength = type - 0xa0;
        return this.decodeUtf8String(byteLength);
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
    } else if (type === 0xca) {
      // float 32
      return this.readF32();
    } else if (type === 0xcb) {
      // float 64
      return this.readF64();
    } else if (type === 0xcc) {
      // uint 8
      return this.readU8();
    } else if (type === 0xcd) {
      // uint 16
      return this.readU16();
    } else if (type === 0xce) {
      // uint 32
      return this.readU32();
    } else if (type === 0xcf) {
      // uint 64
      return this.readU64();
    } else if (type === 0xd0) {
      // int 8
      return this.readI8();
    } else if (type === 0xd1) {
      // int 16
      return this.readI16();
    } else if (type === 0xd2) {
      // int 32
      return this.readI32();
    } else if (type === 0xd3) {
      // int 64
      return this.readI64();
    } else if (type === 0xd9) {
      // str 8
      const length = this.readU8();
      return this.decodeUtf8String(length);
    } else if (type === 0xda) {
      // str 16
      const length = this.readU16();
      return this.decodeUtf8String(length);
    } else if (type === 0xdb) {
      // str 32
      const length = this.readU32();
      return this.decodeUtf8String(length);
    } else if (type === 0xdc) {
      // array 16
      const size = this.readU16();
      return this.decodeArray(size);
    } else if (type === 0xdd) {
      // array 32
      const size = this.readU32();
      return this.decodeArray(size);
    } else if (type === 0xde) {
      // map 16
      const size = this.readU16();
      return this.decodeMap(size);
    } else if (type === 0xdf) {
      // map 32
      const size = this.readU32();
      return this.decodeMap(size);
    } else if (type === 0xc4) {
      // bin 8
      const size = this.readU8();
      return this.decodeBinary(size);
    } else if (type === 0xc5) {
      // bin 16
      const size = this.readU16();
      return this.decodeBinary(size);
    } else if (type === 0xc6) {
      // bin 32
      const size = this.readU32();
      return this.decodeBinary(size);
    } else if (type === 0xd4) {
      // fixext 1
      return this.decodeExtension(1);
    } else if (type === 0xd5) {
      // fixext 2
      return this.decodeExtension(2);
    } else if (type === 0xd6) {
      // fixext 4
      return this.decodeExtension(4);
    } else if (type === 0xd7) {
      // fixext 8
      return this.decodeExtension(8);
    } else if (type === 0xd8) {
      // fixext 16
      return this.decodeExtension(16);
    } else if (type === 0xc7) {
      // ext 8
      const size = this.readU8();
      return this.decodeExtension(size);
    } else if (type === 0xc8) {
      // ext 16
      const size = this.readU16();
      return this.decodeExtension(size);
    } else if (type === 0xc9) {
      // ext 32
      const size = this.readU32();
      return this.decodeExtension(size);
    } else {
      throw new Error(`Unrecognized type byte: ${prettyByte(type)}`);
    }
  }

  decodeUtf8String(byteLength: number): string {
    const pos = this.pos;
    this.pos += byteLength;
    return utf8Decode(this.view, pos, byteLength);
  }

  decodeMap(size: number): Record<string, unknown> {
    const result: Record<string, unknown> = {};
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

  decodeArray(size: number): Array<unknown> {
    const result: Array<unknown> = [];
    for (let i = 0; i < size; i++) {
      result.push(this.decode());
    }
    return result;
  }

  decodeBinary(size: number): Uint8Array {
    const start = this.pos;
    this.pos += size;
    return new Uint8Array(this.view.buffer, this.view.byteOffset + start, size);
  }

  decodeExtension(size: number): unknown {
    const extType = this.readI8();
    const data = this.decodeBinary(size);
    return this.extensionCodec.decode(data, extType);
  }

  readU8(): number {
    return this.view.getUint8(this.pos++);
  }

  readI8(): number {
    return this.view.getInt8(this.pos++);
  }

  readU16(): number {
    const pos = this.pos;
    this.pos += 2;
    return this.view.getUint16(pos);
  }

  readI16(): number {
    const pos = this.pos;
    this.pos += 2;
    return this.view.getInt16(pos);
  }

  readU32(): number {
    const pos = this.pos;
    this.pos += 4;
    return this.view.getUint32(pos);
  }

  readI32(): number {
    const pos = this.pos;
    this.pos += 4;
    return this.view.getInt32(pos);
  }

  readU64(): number {
    const high = this.readU32();
    const low = this.readU32();
    return high * 0x100000000 + low;
  }

  readI64(): number {
    const b1 = this.readU8();
    const b2 = this.readU8();
    const b3 = this.readU8();
    const b4 = this.readU8();
    const b5 = this.readU8();
    const b6 = this.readU8();
    const b7 = this.readU8();
    const b8 = this.readU8();
    return decodeInt64(b1, b2, b3, b4, b5, b6, b7, b8);
  }

  readF32() {
    const pos = this.pos;
    this.pos += 4;
    return this.view.getFloat32(pos);
  }

  readF64() {
    const pos = this.pos;
    this.pos += 8;
    return this.view.getFloat64(pos);
  }
}
