import { getInt64, setInt64 } from "./utils/int";
import { ExtData } from "./ExtData";

export const EXT_TIMESTAMP = -1;

function isDate(object: unknown): object is Date {
  return object instanceof Date;
}

export type TimeSpec = {
  sec: number;
  nsec: number;
};

const TIMESTAMP32_MAX_SEC = 0x100000000; // 32-bit unsigned int
const TIMESTAMP64_MAX_SEC = 0x400000000; // 34-bit unsigned int

export function encodeTimestampFromTimeSpec({ sec, nsec }: TimeSpec): Uint8Array {
  if (sec >= 0 && nsec >= 0 && sec < TIMESTAMP64_MAX_SEC) {
    // Here sec >= 0 && nsec >= 0
    if (nsec === 0 && sec < TIMESTAMP32_MAX_SEC) {
      // timestamp 32 = { sec32 (unsigned) }
      const rv = new Uint8Array(4);
      const view = new DataView(rv.buffer);
      view.setUint32(0, sec);
      return rv;
    } else {
      // timestamp 64 = { nsec30 (unsigned), sec34 (unsigned) }
      const secHigh = sec / 0x100000000;
      const secLow = sec & 0xffffffff;
      const rv = new Uint8Array(8);
      const view = new DataView(rv.buffer);
      // nsec30 | secHigh2
      view.setUint32(0, (nsec << 2) | (secHigh & 0x3));
      // secLow32
      view.setUint32(4, secLow);
      return rv;
    }
  } else {
    // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
    const rv = new Uint8Array(12);
    const view = new DataView(rv.buffer);
    view.setUint32(0, nsec);
    setInt64(view, 4, sec);
    return rv;
  }
}

export function encodeDateToTimeSpec(date: Date): TimeSpec {
  const time = date.getTime();
  const sec = time < 0 ? Math.ceil(time / 1000) : Math.floor(time / 1000);
  const nsec = (time - sec * 1000) * 1e6;
  const nsecInSec = Math.floor(nsec / 1e9);
  // Normalizes nsec to ensure it is unsigned.
  return {
    sec: sec + nsecInSec,
    nsec: nsec - nsecInSec * 1e9,
  };
}

export const encodeTimestampExtension: ExtensionEncoderType = (object: unknown) => {
  if (isDate(object)) {
    const timeSpec = encodeDateToTimeSpec(object);
    return encodeTimestampFromTimeSpec(timeSpec);
  } else {
    return null;
  }
};

// https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
export const decodeTimestampExtension: ExtensionDecoderType = (data: Uint8Array) => {
  // data may be 32, 64, or 96 bits
  switch (data.byteLength) {
    case 4: {
      // timestamp 32 = { sec32 }
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const sec = view.getUint32(0);
      return new Date(sec * 1000);
    }
    case 8: {
      // timestamp 64 = { nsec30, sec34 }
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

      const nsec30AndSecHigh2 = view.getUint32(0);
      const secLow32 = view.getUint32(4);
      const nsec = nsec30AndSecHigh2 >>> 2;
      const sec = (nsec30AndSecHigh2 & 0x3) * 0x100000000 + secLow32;
      return new Date(sec * 1000 + nsec / 1e6);
    }
    case 12: {
      // timestamp 96 = { nsec32 (unsigned), sec64 (signed) }
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

      const nsec = view.getUint32(0);
      const sec = getInt64(view, 4);

      return new Date(sec * 1000 + nsec / 1e6);
    }
    default:
      throw new Error(`Unrecognized data size for timestamp: ${data.length}`);
  }
};

// extensionType is signed 8-bit integer
export type ExtensionDecoderType = (data: Uint8Array, extensionType: number) => any;

export type ExtensionEncoderType = (input: unknown) => Uint8Array | null;

// immutable interfce to ExtensionCodec
export type ExtensionCodecType = {
  tryToEncode(object: unknown): ExtData | null;
  decode(data: Uint8Array, extType: number): unknown;
};

export class ExtensionCodec implements ExtensionCodecType {
  public static readonly defaultCodec: ExtensionCodecType = new ExtensionCodec();

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

  public tryToEncode(object: unknown): ExtData | null {
    // built-in extensions
    for (let i = 0; i < this.builtInEncoders.length; i++) {
      const encoder = this.builtInEncoders[i];
      if (encoder != null) {
        const data = encoder(object);
        if (data != null) {
          const type = -1 - i;
          return new ExtData(type, data);
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
          return new ExtData(type, data);
        }
      }
    }

    if (object instanceof ExtData) {
      // to keep ExtData as is
      return object;
    }
    return null;
  }

  public decode(data: Uint8Array, type: number): unknown {
    const decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
    if (decoder) {
      return decoder(data, type);
    } else {
      // decode() does not fail, returns ExtData instead.
      return new ExtData(type, data);
    }
  }
}
