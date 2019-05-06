import { prettyByte } from "./utils/prettyByte";
import { ExtensionCodecType } from "./ExtensionCodec";
import { decodeInt64 } from "./utils/int";
import { utf8Decode } from "./utils/utf8";
import { createDataView, ensureUint8Array } from "./utils/typedArrays";

enum State {
  ARRAY,
  MAP_KEY,
  MAP_VALUE,
}

type StackMapState = {
  type: State.MAP_KEY | State.MAP_VALUE;
  size: number;
  key: string | null;
  readCount: number;
  map: Record<string, unknown>;
};

type StackArrayState = {
  type: State.ARRAY;
  size: number;
  array: Array<unknown>;
};

type StackState = StackArrayState | StackMapState;

const HEAD_BYTE_REQUIRED = -1;

const EMPTY_VIEW = new DataView(new ArrayBuffer(0));
const MORE_DATA = new RangeError("MORE_DATA");

export class Decoder {
  totalPos = 0;
  pos = 0;

  view: DataView = EMPTY_VIEW;
  headByte = HEAD_BYTE_REQUIRED;
  readonly stack: Array<StackState> = [];

  constructor(readonly extensionCodec: ExtensionCodecType) {}

  setBuffer(buffer: ArrayLike<number> | Uint8Array): void {
    this.view = createDataView(buffer);
    this.pos = 0;
  }

  hasRemaining(size = 0) {
    return this.view.byteLength - this.pos >= size;
  }

  async decodeAsync(buffers: AsyncIterable<ArrayLike<number> | Uint8Array>): Promise<unknown> {
    for await (const buffer of buffers) {
      if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining()) {
        this.setBuffer(buffer);
      } else {
        // retried because data is insufficient
        const remainingData = new Uint8Array(
          this.view.buffer,
          this.view.byteOffset + this.pos,
          this.view.byteLength - this.pos,
        );
        const newData = ensureUint8Array(buffer);
        const concated = new Uint8Array(remainingData.length + newData.length);
        concated.set(remainingData);
        concated.set(newData, remainingData.length);
        this.setBuffer(concated);
      }
      //console.log("view", this.view, this.headByte);

      try {
        return Promise.resolve(this.decodeSync());
      } catch (e) {
        if (!(e instanceof RangeError)) {
          throw e; // rethrow
        }
        // fallthrough
      }
      this.totalPos += this.pos;
    }

    const { headByte, pos, totalPos } = this;
    throw new Error(
      `Insufficient data in parcing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`,
    );
  }

  decodeSync(): unknown {
    DECODE: while (true) {
      const headByte = this.readHeadByte();
      let object: unknown;

      if (headByte >= 0xe0) {
        // negative fixint (111x xxxx) 0xe0 - 0xff
        object = headByte - 0x100;
      } else if (headByte < 0xc0) {
        if (headByte < 0x80) {
          // positive fixint (0xxx xxxx) 0x00 - 0x7f
          object = headByte;
        } else if (headByte < 0x90) {
          // fixmap (1000 xxxx) 0x80 - 0x8f
          const size = headByte - 0x80;
          if (size !== 0) {
            this.pushMapState(size);
            this.complete();
            continue DECODE;
          } else {
            object = {};
          }
        } else if (headByte < 0xa0) {
          // fixarray (1001 xxxx) 0x90 - 0x9f
          const size = headByte - 0x90;
          if (size !== 0) {
            this.pushArrayState(size);
            this.complete();
            continue DECODE;
          } else {
            object = [];
          }
        } else {
          // fixstr (101x xxxx) 0xa0 - 0xbf
          const byteLength = headByte - 0xa0;
          object = this.decodeUtf8String(byteLength, 0);
        }
      } else if (headByte === 0xc0) {
        // nil
        object = null;
      } else if (headByte === 0xc2) {
        // false
        object = false;
      } else if (headByte === 0xc3) {
        // true
        object = true;
      } else if (headByte === 0xca) {
        // float 32
        object = this.readF32();
      } else if (headByte === 0xcb) {
        // float 64
        object = this.readF64();
      } else if (headByte === 0xcc) {
        // uint 8
        object = this.readU8();
      } else if (headByte === 0xcd) {
        // uint 16
        object = this.readU16();
      } else if (headByte === 0xce) {
        // uint 32
        object = this.readU32();
      } else if (headByte === 0xcf) {
        // uint 64
        object = this.readU64();
      } else if (headByte === 0xd0) {
        // int 8
        object = this.readI8();
      } else if (headByte === 0xd1) {
        // int 16
        object = this.readI16();
      } else if (headByte === 0xd2) {
        // int 32
        object = this.readI32();
      } else if (headByte === 0xd3) {
        // int 64
        object = this.readI64();
      } else if (headByte === 0xd9) {
        // str 8
        const byteLength = this.lookU8();
        object = this.decodeUtf8String(byteLength, 1);
      } else if (headByte === 0xda) {
        // str 16
        const byteLength = this.lookU16();
        object = this.decodeUtf8String(byteLength, 2);
      } else if (headByte === 0xdb) {
        // str 32
        const byteLength = this.lookU32();
        object = this.decodeUtf8String(byteLength, 4);
      } else if (headByte === 0xdc) {
        // array 16
        const size = this.readU16();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 0xdd) {
        // array 32
        const size = this.readU32();
        if (size !== 0) {
          this.pushArrayState(size);
          this.complete();
          continue DECODE;
        } else {
          object = [];
        }
      } else if (headByte === 0xde) {
        // map 16
        const size = this.readU16();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 0xdf) {
        // map 32
        const size = this.readU32();
        if (size !== 0) {
          this.pushMapState(size);
          this.complete();
          continue DECODE;
        } else {
          object = {};
        }
      } else if (headByte === 0xc4) {
        // bin 8
        const size = this.lookU8();
        object = this.decodeBinary(size, 1);
      } else if (headByte === 0xc5) {
        // bin 16
        const size = this.lookU16();
        object = this.decodeBinary(size, 2);
      } else if (headByte === 0xc6) {
        // bin 32
        const size = this.lookU32();
        object = this.decodeBinary(size, 4);
      } else if (headByte === 0xd4) {
        // fixext 1
        object = this.decodeExtension(1, 0);
      } else if (headByte === 0xd5) {
        // fixext 2
        object = this.decodeExtension(2, 0);
      } else if (headByte === 0xd6) {
        // fixext 4
        object = this.decodeExtension(4, 0);
      } else if (headByte === 0xd7) {
        // fixext 8
        object = this.decodeExtension(8, 0);
      } else if (headByte === 0xd8) {
        // fixext 16
        object = this.decodeExtension(16, 0);
      } else if (headByte === 0xc7) {
        // ext 8
        const size = this.lookU8();
        object = this.decodeExtension(size, 1);
      } else if (headByte === 0xc8) {
        // ext 16
        const size = this.lookU16();
        object = this.decodeExtension(size, 2);
      } else if (headByte === 0xc9) {
        // ext 32
        const size = this.lookU32();
        object = this.decodeExtension(size, 4);
      } else {
        throw new Error(`Unrecognized type byte: ${prettyByte(headByte)}`);
      }

      this.complete();

      const stack = this.stack;
      while (stack.length > 0) {
        // arrays and maps
        const state = stack[stack.length - 1];
        if (state.type === State.ARRAY) {
          state.array.push(object);
          if (state.array.length === state.size) {
            stack.pop();
            object = state.array;
          } else {
            continue DECODE;
          }
        } else if (state.type === State.MAP_KEY) {
          if (typeof object !== "string") {
            throw new Error("The type of key must be string but " + typeof object);
          }
          state.key = object;
          state.type = State.MAP_VALUE;
          continue DECODE;
        } else if (state.type === State.MAP_VALUE) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state.map[state.key!] = object;
          state.readCount++;

          if (state.readCount === state.size) {
            stack.pop();
            object = state.map;
          } else {
            state.key = null;
            state.type = State.MAP_KEY;
            continue DECODE;
          }
        }
      }

      return object;
    }
  }

  readHeadByte(): number {
    if (this.headByte === HEAD_BYTE_REQUIRED) {
      this.headByte = this.readU8();
      // console.log("headByte", prettyByte(this.headByte));
    }

    return this.headByte;
  }

  complete(): void {
    this.headByte = HEAD_BYTE_REQUIRED;
  }

  pushMapState(size: number) {
    this.stack.push({
      type: State.MAP_KEY,
      size,
      key: null,
      readCount: 0,
      map: {},
    });
  }

  pushArrayState(size: number) {
    this.stack.push({
      type: State.ARRAY,
      size,
      array: [],
    });
  }

  decodeUtf8String(byteLength: number, headOffset: number): string {
    const object = utf8Decode(this.view, this.pos + headOffset, byteLength);
    this.pos += headOffset + byteLength;
    return object;
  }

  decodeBinary(byteLength: number, headOffset: number): Uint8Array {
    if (!this.hasRemaining(byteLength + headOffset)) {
      throw MORE_DATA;
    }

    const object = new Uint8Array(this.view.buffer, this.view.byteOffset + this.pos + headOffset, byteLength);
    this.pos += headOffset + byteLength;
    return object;
  }

  decodeExtension(size: number, headOffset: number): unknown {
    const extType = this.view.getInt8(this.pos + headOffset);
    const data = this.decodeBinary(size, headOffset + 1 /* extType */);
    return this.extensionCodec.decode(data, extType);
  }

  lookU8() {
    return this.view.getUint8(this.pos);
  }

  lookU16() {
    return this.view.getUint16(this.pos);
  }

  lookU32() {
    return this.view.getUint32(this.pos);
  }

  readU8(): number {
    const value = this.view.getUint8(this.pos);
    this.pos++;
    return value;
  }

  readI8(): number {
    const value = this.view.getInt8(this.pos);
    this.pos++;
    return value;
  }

  readU16(): number {
    const value = this.view.getUint16(this.pos);
    this.pos += 2;
    return value;
  }

  readI16(): number {
    const value = this.view.getInt16(this.pos);
    this.pos += 2;
    return value;
  }

  readU32(): number {
    const value = this.view.getUint32(this.pos);
    this.pos += 4;
    return value;
  }

  readI32(): number {
    const value = this.view.getInt32(this.pos);
    this.pos += 4;
    return value;
  }

  readU64(): number {
    const high = this.view.getUint32(this.pos);
    const low = this.view.getUint32(this.pos + 4);
    this.pos += 8;
    return high * 0x100000000 + low;
  }

  readI64(): number {
    const b1 = this.view.getUint8(this.pos);
    const b2 = this.view.getUint8(this.pos + 1);
    const b3 = this.view.getUint8(this.pos + 2);
    const b4 = this.view.getUint8(this.pos + 3);
    const b5 = this.view.getUint8(this.pos + 4);
    const b6 = this.view.getUint8(this.pos + 5);
    const b7 = this.view.getUint8(this.pos + 6);
    const b8 = this.view.getUint8(this.pos + 7);
    this.pos += 8;
    return decodeInt64(b1, b2, b3, b4, b5, b6, b7, b8);
  }

  readF32() {
    const value = this.view.getFloat32(this.pos);
    this.pos += 4;
    return value;
  }

  readF64() {
    const value = this.view.getFloat64(this.pos);
    this.pos += 8;
    return value;
  }
}
