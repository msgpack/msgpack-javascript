import { BufferType } from "./BufferType";
import { encodeUint32, decodeUint32, encodeInt32, decodeInt32, decodeInt64, encodeInt64 } from "./utils/int";

export const EXT_TIMESTAMP = -1;

function isDate(object: unknown): object is Date {
  return Object.prototype.toString.call(object) === '[object Date]';
}

export type TimeSpec = {
  sec: number;
  nsec: number;
}

const TIMESTAMP32_MAX_SEC = 0x100000000; // 32-bit signed int
const TIMESTAMP64_MAX_SEC = 0x400000000; // 34-bit unsigned int

export function encodeTimestampFromTimeSpec({ sec, nsec }: TimeSpec): ReadonlyArray<number> {
  if (sec >= 0 && sec < TIMESTAMP64_MAX_SEC) {
    // Here sec >= 0 && nsec >= 0
    if (nsec === 0 && sec < TIMESTAMP32_MAX_SEC) {
      // timestamp 32 = { sec32 (unsigned) }
      return encodeUint32(sec);
    } else {
      // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
      const secHigh = sec / 0x100000000;
      const secLow = sec & 0xffffffff;
      return [
        // nsec30 + secHigh2
        ...encodeUint32((nsec << 2) | (secHigh & 0x3)),
        // secLow32
        ...encodeUint32(secLow),
      ];
    }
  } else {
    // timestamp 96 = { nsec32 (signed), sec64 (signed) }
    return [...encodeInt32(nsec), ...encodeInt64(sec)];
  }
}

export const encodeTimestampExtension: ExtensionEncoderType = (object: unknown) => {
  if (isDate(object)) {
    const time = object.getTime();
    if (typeof time !== "number") {
      console.warn(`Invalid type of getTime(): ${time} (${typeof time})`);
      return null;
    }
    // Like Math.floor() but trims decmals even for negative numbers
    const sec = time < 0 ? Math.ceil(time / 1000) : Math.floor(time / 1000);
    const nsec = (time - sec * 1000) * 1e6;
    return encodeTimestampFromTimeSpec({ sec, nsec });
  } else {
    return null;
  }
};

// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
export const decodeTimestampExtension: ExtensionDecoderType = (_type: number, data: BufferType) => {
  // data may be 32, 64, or 96 bits
  switch (data.length) {
    case 4: {
      // timestamp 32 = { sec32 }
      const sec = decodeUint32(data[0], data[1], data[2], data[3]);
      return new Date(sec * 1000);
    }
    case 8: {
      // timestamp 64 = { nsec30, sec34 }
      const nsec30AndSecHigh2 = decodeUint32(data[0], data[1], data[2], data[3]);
      const secLow32 = decodeUint32(data[4], data[5], data[6], data[7]);
      const nsec = nsec30AndSecHigh2 >> 2;
      const sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
      return new Date(sec * 1000 + nsec / 1e6);
    }
    case 12: {
      // timestamp 96 = { nsec32 (signed), sec64 (signed) }
      const nsec = decodeInt32(data[0], data[1], data[2], data[3]);
      const sec = decodeInt64(data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11]);

      return new Date(sec * 1000 + nsec / 1e6);
    }
    default:
      throw new Error(`Unrecognized data size for timestamp: ${data.length}`);
  }
};

export type ExtensionDecoderType = (type: number, data: BufferType) => any;

export type ExtensionEncoderType = (input: unknown) => ReadonlyArray<number> | null;

// immutable interfce to ExtensionCodec
export type ExtensionCodecType = {
  tryToEncode(object: unknown): { type: number; data: ReadonlyArray<number> } | null;
  decode(type: number, data: BufferType): any;
};

export class ExtensionCodec implements ExtensionCodecType {
  public static readonly defaultCodec: ExtensionCodecType = new ExtensionCodec();

  public static readonly Extension = Symbol("MessagePack.extension");

  // built-in extensions
  private readonly builtInEncoders: Array<ExtensionEncoderType> = [];
  private readonly builtInDecoders: Array<ExtensionDecoderType> = [];

  // custom extensions
  private readonly encoders: Array<ExtensionEncoderType> = [];
  private readonly decoders: Array<ExtensionDecoderType> = [];

  public constructor() {
    this.register({
      type: EXT_TIMESTAMP,
      encode: encodeTimestampExtension,
      decode: decodeTimestampExtension,
    });
  }

  public register({
    type,
    encode,
    decode,
  }: {
    type: number;
    encode: ExtensionEncoderType;
    decode: ExtensionDecoderType;
  }): void {
    if (type >= 0) {
      // custom extensions
      this.encoders[type] = encode;
      this.decoders[type] = decode;
    } else {
      // built-in extensions
      const index = 1 + type;
      this.builtInEncoders[index] = encode;
      this.builtInDecoders[index] = decode;
    }
  }

  public tryToEncode(object: unknown): { type: number; data: ReadonlyArray<number> } | null {
    // built-in extensions
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const encoder = this.builtInEncoders[i];
      if (encoder != null) {
        const data = encoder(object);
        if (data != null) {
          const type = -1 - i;
          return {
            type,
            data,
          };
        }
      }
    }

    // custom extensions
    for (let i = 0; i < this.encoders.length; i++) {
      const encoder = this.encoders[i];
      if (encoder != null) {
        const data = encoder(object);
        if (data != null) {
          const type = i;
          return {
            type,
            data,
          };
        }
      }
    }
    return null;
  }

  public decode(type: number, data: BufferType): any {
    const decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decoder) {
      return decoder(type, data);
    } else {
      return {
        [ExtensionCodec.Extension]: true,
        type,
        data,
      };
    }
  }
}
