import { utf8Encode } from "./utils/uf8Encode";
import { ExtensionCodecType, ExtDataType } from "./ExtensionCodec";
import { encodeInt64, encodeUint64 } from "./utils/int";
import { ensureUint8Array } from "./utils/typedArrays";

export class Encoder {
  private pos = 0;
  private view = new DataView(new ArrayBuffer(64));

  constructor(readonly maxDepth: number, readonly extensionCodec: ExtensionCodecType) {}

  encode(object: unknown, depth: number): void {
    if (depth > this.maxDepth) {
      throw new Error(`Too deep objects in depth ${depth}`);
    }

    if (object == null) {
      this.encodeNil();
    } else if (typeof object === "boolean") {
      this.encodeBoolean(object);
    } else if (typeof object === "number") {
      this.encodeNumber(object);
    } else if (typeof object === "bigint") {
      this.encodeBigInt(object);
    } else if (typeof object === "string") {
      this.encodeString(object);
    } else if (typeof object === "object") {
      this.encodeObject(object!, depth);
    } else {
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
    }
  }

  getArrayBuffer(): ArrayBuffer {
    return this.view.buffer.slice(0, this.pos);
  }

  getUint8Array(): Uint8Array {
    return new Uint8Array(this.getArrayBuffer());
  }

  ensureBufferSizeToWrite(sizeToWrite: number) {
    const newSize = this.pos + sizeToWrite;

    if (this.view.byteLength < newSize) {
      // TODO: ensure the size to be multiple of 4 and use Uint32Array for performance
      const newBuffer = new ArrayBuffer(newSize * 2);

      new Uint8Array(newBuffer).set(new Uint8Array(this.view.buffer));

      const newView = new DataView(newBuffer);
      this.view = newView;
    }
  }

  encodeNil() {
    this.writeU8(0xc0);
  }

  encodeBoolean(object: boolean) {
    if (object === false) {
      this.writeU8(0xc2);
    } else {
      this.writeU8(0xc3);
    }
  }
  encodeNumber(object: number) {
    if (Number.isSafeInteger(object)) {
      if (object >= 0) {
        if (object < 0x80) {
          // positive fixint
          this.writeU8(object);
        } else if (object < 0x100) {
          // uint 8
          this.writeU8v(0xcc, object);
        } else if (object < 0x10000) {
          // uint 16
          this.writeU8(0xcd);
          this.writeU16(object);
        } else if (object < 0x100000000) {
          // uint 32
          this.writeU8(0xce);
          this.writeU32(object);
        } else {
          // uint 64
          this.writeU8(0xcf);
          this.writeU64(object);
        }
      } else {
        if (object >= -0x20) {
          // nagative fixint
          this.writeU8(0xe0 | (object + 0x20));
        } else if (object > -0x80) {
          // int 8
          this.writeU8(0xd0);
          this.writeI8(object);
        } else if (object >= -0x8000) {
          // int 16
          this.writeU8(0xd1);
          this.writeI16(object);
        } else if (object >= -0x80000000) {
          // int 32
          this.writeU8(0xd2);
          this.writeI32(object);
        } else {
          // int 64
          this.writeU8(0xd3);
          this.writeI64(object);
        }
      }
    } else {
      this.writeU8(0xcb);
      this.writeF64(object);
    }
  }

  encodeBigInt(_object: bigint) {
    // BigInt literals is not available here!
    throw new Error("BigInt is not yet implemented!");
  }

  encodeString(object: string) {
    const bytes = utf8Encode(object);
    const byteLength = bytes.length;
    if (byteLength < 32) {
      // fixstr
      this.writeU8(0xa0 + byteLength);
    } else if (byteLength < 0x100) {
      // str 8
      this.writeU8(0xd9);
      this.writeU8(byteLength);
    } else if (byteLength < 0x10000) {
      // str 16
      this.writeU8(0xda);
      this.writeU16(byteLength);
    } else if (byteLength < 0x100000000) {
      // str 32
      this.writeU8(0xdb);
      this.writeU32(byteLength);
    } else {
      throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
    }

    this.writeU8v(...bytes);
  }

  encodeObject(object: object, depth: number) {
    // try to encode objects with custom codec first of non-primitives
    const ext = this.extensionCodec.tryToEncode(object);
    if (ext != null) {
      this.encodeExtension(ext);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
    } else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
    } else {
      this.encodeMap(object as Record<string, unknown>, depth);
    }
  }

  encodeBinary(object: ArrayBufferView) {
    const size = object.byteLength;
    if (size < 0x100) {
      // bin 8
      this.writeU8(0xc4);
      this.writeU8(size);
    } else if (size < 0x10000) {
      // bin 16
      this.writeU8(0xc5);
      this.writeU16(size);
    } else if (size < 0x100000000) {
      // bin 32
      this.writeU8(0xc6);
      this.writeU32(size);
    } else {
      throw new Error(`Too large binary: ${size}`);
    }
    const bytes = ensureUint8Array(object);
    this.writeU8v(...bytes);
  }

  encodeArray(object: Array<unknown>, depth: number) {
    const size = object.length;
    if (size < 16) {
      // fixarray
      this.writeU8(0x90 + size);
    } else if (size < 0x10000) {
      // array 16
      this.writeU8(0xdc);
      this.writeU16(size);
    } else if (size < 0x100000000) {
      // array 32
      this.writeU8(0xdd);
      this.writeU32(size);
    } else {
      throw new Error(`Too large array: ${size}`);
    }
    for (const item of object) {
      this.encode(item, depth + 1);
    }
  }

  encodeMap(object: Record<string, unknown>, depth: number) {
    const keys = Object.keys(object);
    const size = keys.length;
    // map
    if (size < 16) {
      // fixmap
      this.writeU8(0x80 + size);
    } else if (size < 0x10000) {
      // map 16
      this.writeU8(0xde);
      this.writeU16(size);
    } else if (size < 0x100000000) {
      // map 32
      this.writeU8(0xdf);
      this.writeU32(size);
    }
    for (const key of keys) {
      this.encodeString(key);
      this.encode(object[key], depth + 1);
    }
  }

  encodeExtension(ext: ExtDataType) {
    const size = ext.data.length;
    if (size === 1) {
      // fixext 1
      this.writeU8(0xd4);
    } else if (size === 2) {
      // fixext 2
      this.writeU8(0xd5);
    } else if (size === 4) {
      // fixext 4
      this.writeU8(0xd6);
    } else if (size === 8) {
      // fixext 8
      this.writeU8(0xd7);
    } else if (size === 16) {
      // fixext 16
      this.writeU8(0xd8);
    } else if (size < 0x100) {
      // ext 8
      this.writeU8(0xc7);
      this.writeU8(size);
    } else if (size < 0x10000) {
      // ext 16
      this.writeU8(0xc8);
      this.writeU16(size);
    } else if (size < 0x100000000) {
      // ext 32
      this.writeU8(0xc9);
      this.writeU32(size);
    } else {
      throw new Error(`Too large extension object: ${size}`);
    }
    this.writeI8(ext.type);
    this.writeU8v(...ext.data);
  }

  writeU8(value: number) {
    this.ensureBufferSizeToWrite(1);

    this.view.setUint8(this.pos++, value);
  }

  writeU8v(...values: ReadonlyArray<number>) {
    const size = values.length;
    this.ensureBufferSizeToWrite(size);

    const pos = this.pos;
    for (let i = 0; i < size; i++) {
      this.view.setUint8(pos + i, values[i]);
    }
    this.pos += size;
  }

  writeI8(value: number) {
    this.ensureBufferSizeToWrite(1);

    this.view.setInt8(this.pos++, value);
  }

  writeU16(value: number) {
    this.ensureBufferSizeToWrite(2);

    const pos = this.pos;
    this.pos += 2;
    this.view.setUint16(pos, value);
  }

  writeI16(value: number) {
    this.ensureBufferSizeToWrite(2);

    const pos = this.pos;
    this.pos += 2;
    this.view.setInt16(pos, value);
  }

  writeU32(value: number) {
    this.ensureBufferSizeToWrite(4);

    const pos = this.pos;
    this.pos += 4;
    this.view.setUint32(pos, value);
  }

  writeI32(value: number) {
    this.ensureBufferSizeToWrite(4);

    const pos = this.pos;
    this.pos += 4;
    this.view.setInt32(pos, value);
  }

  writeF64(value: number) {
    this.ensureBufferSizeToWrite(8);

    const pos = this.pos;
    this.pos += 8;
    this.view.setFloat64(pos, value);
  }

  writeU64(value: number) {
    this.ensureBufferSizeToWrite(8);

    const pos = this.pos;
    this.pos += 8;
    encodeUint64(value, this.view, pos);
  }

  writeI64(value: number) {
    this.ensureBufferSizeToWrite(8);

    const pos = this.pos;
    this.pos += 8;
    encodeInt64(value, this.view, pos);
  }
}
