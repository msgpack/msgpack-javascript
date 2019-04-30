import { utf8Encode } from "./utils/uf8Encode";

type Writable<T> = {
  push(...items: ReadonlyArray<T>): number;
};

type EncodeOptions = Readonly<{
  output?: Array<number>;
  maxDepth?: number;

  // TODO: to handle extension types
}>;

const DefaultOptions = {
  maxDepth: 100,
};

export function encode(value: unknown, options: EncodeOptions = DefaultOptions): Array<number> {
  const result = options.output || [];

  _encode(result, 1, value, options);

  return result;
}
function _encode(rv: Writable<number>, depth: number, object: unknown, options: EncodeOptions) {
  if (depth > options.maxDepth!) {
    throw new Error("Too deep object!");
  }

  if (object == null) {
    rv.push(0xc0);
  } else if (object === false) {
    rv.push(0xc2);
  } else if (object === true) {
    rv.push(0xc3);
  } else if (typeof object === "number") {
    // int or float

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
          rv.push(0xce, object >>> 24, (object >> 16) & 0xff, (object >> 8) & 0xff, object & 0xff);
        } else {
          // uint64
          const high = object / 0x100000000;
          const low = object & 0xffffffff;
          rv.push(
            0xcf,
            (high >> 24) & 0xff,
            (high >> 16) & 0xff,
            (high >> 8) & 0xff,
            high & 0xff,
            (low >> 24) & 0xff,
            (low >> 16) & 0xff,
            (low >> 8) & 0xff,
            low & 0xff,
          );
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
          object += 0x100000000;
          rv.push(0xd2, object >>> 24, (object >> 16) & 0xff, (object >> 8) & 0xff, object & 0xff);
        } else {
          // int 64
          const high = object / 0x100000000;
          const low = object & 0xffffffff;
          rv.push(
            0xd3,
            (high >> 24) & 0xff,
            (high >> 16) & 0xff,
            (high >> 8) & 0xff,
            high & 0xff,
            (low >> 24) & 0xff,
            (low >> 16) & 0xff,
            (low >> 8) & 0xff,
            low & 0xff,
          );
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

      rv.push(
        0xcb,
        (high >> 24) & 0xff,
        (high >> 16) & 0xff,
        (high >> 8) & 0xff,
        high & 0xff,
        (low >> 24) & 0xff,
        (low >> 16) & 0xff,
        (low >> 8) & 0xff,
        low & 0xff,
      );
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
  } else if (typeof object === "string") {
    // str

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
      rv.push(0xdb, size >>> 24, (size >> 16) & 0xff, (size >> 8) & 0xff, size & 0xff);
    } else {
      throw new Error(`Too long string: ${size} bytes in UTF-8`);
    }

    rv.push(...bytes);
  } else if (ArrayBuffer.isView(object)) {
    // bin
    const size = object.byteLength;
    if (size < 0x100) {
      // bin 8
      rv.push(0xc4, size);
    } else if (size < 0x10000) {
      // bin 16
      rv.push(0xc5, size >> 8, size & 0xff);
    } else if (size < 0x100000000) {
      // bin 32
      rv.push(0xc6, size >>> 24, (size >> 16) & 0xff, (size >> 8) & 0xff, size & 0xff);
    } else {
      throw new Error(`Too large binary: ${size}`);
    }

    const bytes = isNodeJsBuffer(object) ? object : new Uint8Array(object.buffer);
    for (let i = 0; i < size; i++) {
      rv.push(bytes[i]);
    }
  } else if (Array.isArray(object)) {
    // array

    const size = object.length;
    if (size < 16) {
      // fixarray
      rv.push(0x90 + size);
    } else if (size < 0x10000) {
      // array 16
      rv.push(0xdc, size >> 8, size & 0xff);
    } else if (size < 0x100000000) {
      // 32
      rv.push(0xdd, size >>> 24, (size >> 16) & 0xff, (size >> 8) & 0xff, size & 0xff);
    } else {
      throw new Error(`Too large array: ${size}`);
    }
    for (const item of object) {
      _encode(rv, depth + 1, item, options);
    }
  } else if (isObject(object)) {
    // FIXME: extensions

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
      rv.push(0xdf, size >>> 24, (size >> 16) & 0xff, (size >> 8) & 0xff, size & 0xff);
    }

    for (const key of keys) {
      _encode(rv, depth + 1, key, options);
      _encode(rv, depth + 1, object[key], options);
    }
  } else {
    // symbol, function, etc.
    throw new Error(`Unknown object: ${Object.prototype.toString.apply(object)}`);
  }
}

function isObject(object: unknown): object is Record<string, unknown> {
  return typeof object === "object" && object !== null;
}

function isNodeJsBuffer(object: unknown): object is Buffer {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(object);
}
