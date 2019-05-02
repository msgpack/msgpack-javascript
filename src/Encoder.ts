import { utf8Encode } from "./utils/uf8Encode";
import { ExtensionCodecType } from "./ExtensionCodec";
import { encodeUint32, encodeInt64, encodeInt32, encodeUint64 } from "./utils/int";
import { isNodeJsBuffer } from "./utils/is";
import { Writable } from "./Writable";

type EncodeMethodType<OutputType extends Writable<number>> = (
  this: Encoder<OutputType>,
  rv: OutputType,
  object: unknown,
  depth: number,
) => void;

export class Encoder<OutputType extends Writable<number>> {
  readonly typeofMap = {
    "undefined": this.encodeNil,
    "boolean": this.encodeBoolean,
    "number": this.encodeNumber,
    "bigint": this.encodeBigInt,
    "string": this.encodeString,
    "object": this.encodeObject,
  } as Record<string, EncodeMethodType<OutputType>>;

  constructor(readonly maxDepth: number, readonly extensionCodec: ExtensionCodecType) {}

  encode(rv: OutputType, object: unknown, depth: number): void {
    if (depth > this.maxDepth) {
      throw new Error(`Too deep objects in depth ${depth}`);
    }
    const encodeFunc = this.typeofMap[typeof object];
    if (!encodeFunc) {
      throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
    }
    encodeFunc.call(this, rv, object, depth);
  }
  encodeNil(rv: OutputType) {
    rv.push(0xc0);
  }
  encodeBoolean(rv: OutputType, object: boolean) {
    if (object === false) {
      rv.push(0xc2);
    } else {
      rv.push(0xc3);
    }
  }
  encodeNumber(rv: OutputType, object: number) {
    if (Number.isSafeInteger(object)) {
      if (object >= 0) {
        if (object < 0x80) {
          // positive fixint
          rv.push(object);
        } else if (object < 0x100) {
          // uint 8
          rv.push(0xcc, object);
        } else if (object < 0x10000) {
          // uint 16
          rv.push(0xcd, object >> 8, object & 0xff);
        } else if (object < 0x100000000) {
          // uint 32
          rv.push(0xce);
          encodeUint32(rv, object);
        } else {
          // uint 64
          rv.push(0xcf);
          encodeUint64(rv, object);
        }
      } else {
        if (object >= -0x20) {
          // nagative fixint
          rv.push(0xe0 | (object + 0x20));
        } else if (object > -0x80) {
          // int 8
          rv.push(0xd0, object + 0x100);
        } else if (object >= -0x8000) {
          // int 16
          object += 0x10000;
          rv.push(0xd1, object >> 8, object & 0xff);
        } else if (object >= -0x80000000) {
          // int 32
          rv.push(0xd2);
          encodeInt32(rv, object);
        } else {
          // int 64
          rv.push(0xd3);
          encodeInt64(rv, object);
        }
      }
    } else if (Number.isFinite(object)) {
      // THX!! @edvakf
      // http://javascript.g.hatena.ne.jp/edvakf/20101128/1291000731
      const negative = object === 0 ? Object.is(object, -0.0) : object < 0;
      const value = negative ? -object : object;
      let exp = (Math.log(value) / Math.LN2 + 1023) | 0;
      const frac = value * Math.pow(2, 52 + 1023 - exp);
      const low = frac & 0xffffffff;
      if (negative) {
        exp |= 0x800;
      }
      const high = ((frac / 0x100000000) & 0xfffff) | (exp << 20);
      rv.push(0xcb);
      encodeUint32(rv, high);
      encodeUint32(rv, low);
    } else {
      rv.push(0xcb);
      if (object === Infinity) {
        rv.push(0x7f, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
      } else if (object === -Infinity) {
        rv.push(0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
      } else {
        // NaN
        rv.push(0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff);
      }
    }
  }
  encodeBigInt(_rv: OutputType, _object: bigint) {
    // BigInt literals is not available here!
    throw new Error("BigInt is not yet implemented!");
  }
  encodeString(rv: OutputType, object: string) {
    const bytes = utf8Encode(object);
    const size = bytes.length;
    if (size < 32) {
      // fixstr
      rv.push(0xa0 + size);
    } else if (size < 0x100) {
      // str 8
      rv.push(0xd9, size);
    } else if (size < 0x10000) {
      // str 16
      rv.push(0xda, size >> 8, size & 0xff);
    } else if (size < 0x100000000) {
      // str 32
      rv.push(0xdb);
      encodeUint32(rv, size);
    } else {
      throw new Error(`Too long string: ${size} bytes in UTF-8`);
    }
    rv.push(...bytes);
  }
  encodeObject(rv: OutputType, object: object | null, depth: number) {
    if (object === null) {
      this.encodeNil(rv);
      return;
    }
    // try to encode objects with custom codec first of non-primitives
    const ext = this.extensionCodec.tryToEncode(object);
    if (ext != null) {
      this.encodeExtension(rv, ext);
    } else if (ArrayBuffer.isView(object)) {
      this.encodeBinary(rv, object);
    } else if (Array.isArray(object)) {
      this.encodeArray(rv, object, depth);
    } else {
      this.encodeMap(rv, object as Record<string, unknown>, depth);
    }
  }
  encodeBinary(rv: OutputType, object: ArrayBufferView) {
    const size = object.byteLength;
    if (size < 0x100) {
      // bin 8
      rv.push(0xc4, size);
    } else if (size < 0x10000) {
      // bin 16
      rv.push(0xc5, size >> 8, size & 0xff);
    } else if (size < 0x100000000) {
      // bin 32
      rv.push(0xc6);
      encodeUint32(rv, size);
    } else {
      throw new Error(`Too large binary: ${size}`);
    }
    const bytes = isNodeJsBuffer(object) ? object : new Uint8Array(object.buffer);
    for (let i = 0; i < size; i++) {
      rv.push(bytes[i]);
    }
  }
  encodeArray(rv: OutputType, object: Array<unknown>, depth: number) {
    const size = object.length;
    if (size < 16) {
      // fixarray
      rv.push(0x90 + size);
    } else if (size < 0x10000) {
      // array 16
      rv.push(0xdc, size >> 8, size & 0xff);
    } else if (size < 0x100000000) {
      // array 32
      rv.push(0xdd);
      encodeUint32(rv, size);
    } else {
      throw new Error(`Too large array: ${size}`);
    }
    for (const item of object) {
      this.encode(rv, item, depth + 1);
    }
  }
  encodeMap(rv: OutputType, object: Record<string, unknown>, depth: number) {
    const keys = Object.keys(object);
    const size = keys.length;
    // map
    if (size < 16) {
      // fixmap
      rv.push(0x80 + size);
    } else if (size < 0x10000) {
      // map 16
      rv.push(0xde, size >> 8, size & 0xff);
    } else if (size < 0x100000000) {
      // map 32
      rv.push(0xdf);
      encodeUint32(rv, size);
    }
    for (const key of keys) {
      this.encodeString(rv, key);
      this.encode(rv, object[key], depth + 1);
    }
  }
  encodeExtension(
    rv: OutputType,
    ext: {
      type: number;
      data: ReadonlyArray<number>;
    },
  ) {
    const size = ext.data.length;
    const typeByte = ext.type < 0 ? ext.type + 0x100 : ext.type;
    if (size === 1) {
      // fixext 1
      rv.push(0xd4, typeByte, ...ext.data);
    } else if (size === 2) {
      // fixext 2
      rv.push(0xd5, typeByte, ...ext.data);
    } else if (size === 4) {
      // fixext 4
      rv.push(0xd6, typeByte, ...ext.data);
    } else if (size === 8) {
      // fixext 8
      rv.push(0xd7, typeByte, ...ext.data);
    } else if (size === 16) {
      // fixext 16
      rv.push(0xd8, typeByte, ...ext.data);
    } else if (size < 0x100) {
      // ext 8
      rv.push(0xc7, size, typeByte, ...ext.data);
    } else if (size < 0x10000) {
      // ext 16
      rv.push(0xc8, size >> 8, size & 0xff, typeByte, ...ext.data);
    } else if (size < 0x100000000) {
      // ext 32
      rv.push(0xc9);
      encodeUint32(rv, size), rv.push(typeByte, ...ext.data);
    } else {
      throw new Error(`Too large extension object: ${size}`);
    }
  }
}
