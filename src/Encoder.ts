import { utf8Encode, utf8Count } from "./utils/utf8";
import { ExtensionCodec } from "./ExtensionCodec";
import { setInt64, setUint64 } from "./utils/int";
import { ensureUint8Array } from "./utils/typedArrays";
import { ExtData } from "./ExtData";
import { WASM_AVAILABLE, utf8EncodeWasm, WASM_STR_THRESHOLD } from "./wasmFunctions";

export const DEFAULT_MAX_DEPTH = 100;
export const DEFAULT_INITIAL_BUFFER_SIZE = 2048;

export class Encoder {
  private pos = 0;
  private view = new DataView(new ArrayBuffer(this.initialBufferSize));
  private bytes = new Uint8Array(this.view.buffer);

  constructor(
    readonly extensionCodec = ExtensionCodec.defaultCodec,
    readonly maxDepth = DEFAULT_MAX_DEPTH,
    readonly initialBufferSize = DEFAULT_INITIAL_BUFFER_SIZE,
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

    if (WASM_AVAILABLE && strLength > WASM_STR_THRESHOLD) {
      // ensure max possible size
      const maxSize = maxHeaderSize + strLength * 4;
      this.ensureBufferSizeToWrite(maxSize);

      // utf8EncodeWasm() handles headByte+size as well as string itself
      const ouputLength = utf8EncodeWasm(object, this.bytes, this.pos);
      this.pos += ouputLength;
      return;
    } else {
      const byteLength = utf8Count(object);
      this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
      this.writeStringHeader(byteLength);
      utf8Encode(object, this.bytes, this.pos);
      this.pos += byteLength;
    }
  }

  encodeObject(object: unknown, depth: number) {
    // try to encode objects with custom codec first of non-primitives
    const ext = this.extensionCodec.tryToEncode(object);
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

  countObjectKeys(object: Record<string, unknown>): number {
    let count = 0;
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        count++;
      }
    }
    return count;
  }

  encodeMap(object: Record<string, unknown>, depth: number) {
    const size = this.countObjectKeys(object);
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
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        this.encodeString(key);
        this.encode(object[key], depth + 1);
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
    this.writeU8v(...ext.data);
  }

  writeU8(value: number) {
    this.ensureBufferSizeToWrite(1);

    this.view.setUint8(this.pos, value);
    this.pos++;
  }

  writeU8v(...values: Array<number>) {
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
