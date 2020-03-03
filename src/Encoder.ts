import { utf8EncodeJs, utf8Count, TEXT_ENCODING_AVAILABLE, TEXT_ENCODER_THRESHOLD, utf8EncodeTE } from "./utils/utf8";
import { ExtensionCodec, ExtensionCodecType } from "./ExtensionCodec";
import { setInt64, setUint64 } from "./utils/int";
import { ensureUint8Array } from "./utils/typedArrays";
import { ExtData } from "./ExtData";

export const DEFAULT_MAX_DEPTH = 100;
export const DEFAULT_INITIAL_BUFFER_SIZE = 2048;

export class Encoder<ContextType> {
  private pos = 0;
  private view = new DataView(new ArrayBuffer(this.initialBufferSize));
  private bytes = new Uint8Array(this.view.buffer);

  constructor(
    readonly extensionCodec: ExtensionCodecType<ContextType> = ExtensionCodec.defaultCodec as any,
    readonly context: ContextType,
    readonly maxDepth = DEFAULT_MAX_DEPTH,
    readonly initialBufferSize = DEFAULT_INITIAL_BUFFER_SIZE,
    readonly sortKeys = false,
    readonly forceFloat32 = false,
    readonly ignoreUndefined = false,
  ) {}

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
    } else if (typeof object === "string") {
      this.encodeString(object);
    } else {
      this.encodeObject(object, depth);
    }
  }

  getUint8Array(): Uint8Array {
    return this.bytes.subarray(0, this.pos);
  }

  ensureBufferSizeToWrite(sizeToWrite: number) {
    const requiredSize = this.pos + sizeToWrite;

    if (this.view.byteLength < requiredSize) {
      this.resizeBuffer(requiredSize * 2);
    }
  }

  resizeBuffer(newSize: number) {
    const newBuffer = new ArrayBuffer(newSize);
    const newBytes = new Uint8Array(newBuffer);
    const newView = new DataView(newBuffer);

    newBytes.set(this.bytes);

    this.view = newView;
    this.bytes = newBytes;
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
          this.writeU8(0xcc);
          this.writeU8(object);
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
        } else if (object >= -0x80) {
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
      // non-integer numbers
      if (this.forceFloat32) {
        // float 32
        this.writeU8(0xca);
        this.writeF32(object);
      } else {
        // float 64
        this.writeU8(0xcb);
        this.writeF64(object);
      }
    }
  }

  writeStringHeader(byteLength: number) {
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
  }

  encodeString(object: string) {
    const maxHeaderSize = 1 + 4;
    const strLength = object.length;

    if (TEXT_ENCODING_AVAILABLE && strLength > TEXT_ENCODER_THRESHOLD) {
      const byteLength = utf8Count(object);
      this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
      this.writeStringHeader(byteLength);
      utf8EncodeTE(object, this.bytes, this.pos);
      this.pos += byteLength;
    } else {
      const byteLength = utf8Count(object);
      this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
      this.writeStringHeader(byteLength);
      utf8EncodeJs(object, this.bytes, this.pos);
      this.pos += byteLength;
    }
  }

  encodeObject(object: unknown, depth: number) {
    // try to encode objects with custom codec first of non-primitives
    const ext = this.extensionCodec.tryToEncode(object, this.context);
    if (ext != null) {
      this.encodeExtension(ext);
    } else if (Array.isArray(object)) {
      this.encodeArray(object, depth);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(object);
    } else if (typeof object === "object") {
      this.encodeMap(object as Record<string, unknown>, depth);
    } else {
      // symbol, function and other special object come here unless extensionCodec handles them.
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
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
    this.writeU8a(bytes);
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

  countWithoutUndefined(object: Record<string, unknown>, keys: ReadonlyArray<string>): number {
    let count = 0;

    for (const key of keys) {
      if (object[key] !== undefined) {
        count++;
      }
    }

    return count;
  }

  encodeMap(object: Record<string, unknown>, depth: number) {
    const keys = Object.keys(object);
    if (this.sortKeys) {
      keys.sort();
    }

    const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;

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
    } else {
      throw new Error(`Too large map object: ${size}`);
    }

    for (const key of keys) {
      const value = object[key];

      if (!(this.ignoreUndefined && value === undefined)) {
        this.encodeString(key);
        this.encode(value, depth + 1);
      }
    }
  }

  encodeExtension(ext: ExtData) {
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
    this.writeU8a(ext.data);
  }

  writeU8(value: number) {
    this.ensureBufferSizeToWrite(1);

    this.view.setUint8(this.pos, value);
    this.pos++;
  }

  writeU8a(values: ArrayLike<number>) {
    const size = values.length;
    this.ensureBufferSizeToWrite(size);

    this.bytes.set(values, this.pos);
    this.pos += size;
  }

  writeI8(value: number) {
    this.ensureBufferSizeToWrite(1);

    this.view.setInt8(this.pos, value);
    this.pos++;
  }

  writeU16(value: number) {
    this.ensureBufferSizeToWrite(2);

    this.view.setUint16(this.pos, value);
    this.pos += 2;
  }

  writeI16(value: number) {
    this.ensureBufferSizeToWrite(2);

    this.view.setInt16(this.pos, value);
    this.pos += 2;
  }

  writeU32(value: number) {
    this.ensureBufferSizeToWrite(4);

    this.view.setUint32(this.pos, value);
    this.pos += 4;
  }

  writeI32(value: number) {
    this.ensureBufferSizeToWrite(4);

    this.view.setInt32(this.pos, value);
    this.pos += 4;
  }

  writeF32(value: number) {
    this.ensureBufferSizeToWrite(4);
    this.view.setFloat32(this.pos, value);
    this.pos += 4;
  }

  writeF64(value: number) {
    this.ensureBufferSizeToWrite(8);
    this.view.setFloat64(this.pos, value);
    this.pos += 8;
  }

  writeU64(value: number) {
    this.ensureBufferSizeToWrite(8);

    setUint64(this.view, this.pos, value);
    this.pos += 8;
  }

  writeI64(value: number) {
    this.ensureBufferSizeToWrite(8);

    setInt64(this.view, this.pos, value);
    this.pos += 8;
  }
}
