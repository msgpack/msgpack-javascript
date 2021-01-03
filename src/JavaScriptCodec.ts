// Implementation of "Structured Clone" algorithm in MessagPack
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

import { ExtensionCodec, ExtensionCodecType } from "./ExtensionCodec";
import { encode } from "./encode";
import { decode } from "./decode";

export const EXT_JAVASCRIPT = 0;

const enum JS {
  // defined in "structured clone algorithm"
  // commente-outed ones are TODOs

  // Boolean = "Boolean",
  // String = "String",
  Date = "Date",
  RegExp = "RegExp",
  // Blob = "Blob",
  // File = "File",
  // FileList = "FileList",
  ArrayBuffer = "ArrayBuffer",
  Int8Array = "Int8Array",
  Uint8Array = "Uint8Array",
  Uint8ClampedArray = "Uint8ClampedArray",
  Int16Array = "Int16Array",
  Uint16Array = "Uint16Array",
  Int32Array = "Int32Array",
  Uint32Array = "Uint32Array",
  Float32Array = "Float32Array",
  Float64Array = "Float64Array",
  BigInt64Array = "BigInt64Array",
  BigUint64Array = "BigUint64Array",
  DataView = "DataView",
  // ImageBitMap = "ImageBitMap",
  // ImageData = "ImageData",
  Map = "Map",
  Set = "Set",

  // and more
  BigInt = "BigInt",
}

export function encodeJavaScriptStructure(input: unknown): Uint8Array | null {
  if (!(input instanceof Object)) {
    if (typeof input === "bigint") {
      return encode([JS.BigInt, input.toString()]);
    } else {
      return null;
    }
  }
  const type = input.constructor.name;

  if (ArrayBuffer.isView(input)) {
    if (type === JS.Uint8Array) {
      return null; // fall through to the default encoder
    } else if (type === JS.DataView || type === JS.Int8Array || type === JS.Uint8ClampedArray) {
      // handles them as a byte buffer
      const v = new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
      return encode([type, v]);
    } else {
      // handles them as a number array for portability
      return encode([type, ...(input as unknown as Iterable<number>)]);
    }
  } else if (type === JS.ArrayBuffer) {
    const bufferView = new Uint8Array(input as ArrayBuffer);
    return encode([type, bufferView]);
  } else if (type === JS.Map) {
    return encode([JS.Map, ...input as Map<unknown, unknown>]);
  } else if (type === JS.Set) {
    return encode([JS.Set, ...input as Set<unknown>]);
  } else if (type === JS.Date) {
    return encode([JS.Date, (input as Date).getTime()]);
  } else if (type === JS.RegExp) {
    return encode([JS.RegExp, (input as RegExp).source, (input as RegExp).flags]);
  } else {
    return null;
  }
}

export function decodeJavaScriptStructure(data: Uint8Array) {
  const [type, ...source] = decode(data) as [JS, ...any];
  switch (type) {
    case JS.BigInt: {
      const [str] = source;
      return BigInt(str);
    }
    case JS.Date: {
      const [millis] = source;
      return new Date(millis);
    }
    case JS.RegExp: {
      const [pattern, flags] = source;
      return new RegExp(pattern, flags);
    }
    case JS.ArrayBuffer: {
      const [buffer] = source as [Uint8Array];
      return buffer.slice(0).buffer;
    }
    case JS.Int8Array: {
      const [v] = source as [Uint8Array];
      return new Int8Array(v.buffer, v.byteOffset, v.byteLength);
    }
    case JS.Uint8Array: {
      // unlikely because it is handled by the default decoder,
      // but technically possible with no conflict.
      const [v] = source as [Uint8Array];
      return new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
    }
    case JS.Uint8ClampedArray: {
      const [v] = source as [Uint8Array];
      return new Uint8ClampedArray(v.buffer, v.byteOffset, v.byteLength);
    }
    case JS.Int16Array: {
      return Int16Array.from(source as ReadonlyArray<number>);
    }
    case JS.Uint16Array: {
      return Uint16Array.from(source as ReadonlyArray<number>);
    }
    case JS.Int32Array: {
      return Int32Array.from(source as ReadonlyArray<number>);
    }
    case JS.Uint32Array: {
      return Uint32Array.from(source as ReadonlyArray<number>);
    }
    case JS.Float32Array: {
      return Float32Array.from(source as ReadonlyArray<number>);
    }
    case JS.Float64Array: {
      return Float64Array.from(source as ReadonlyArray<number>);
    }
    case JS.BigInt64Array: {
      return BigInt64Array.from(source as ReadonlyArray<bigint>);
    }
    case JS.BigUint64Array: {
      return BigUint64Array.from(source as ReadonlyArray<bigint>);
    }
    case JS.DataView: {
      const [v] = source as [Uint8Array];
      return new DataView(v.buffer, v.byteOffset, v.byteLength);
    }
    case JS.Map: {
      return new Map(source);
    }
    case JS.Set: {
      return new Set(source);
    }
    default: {
      throw new Error(`Unknown data type: ${type}`);
    }
  }
}

export const JavaScriptCodec: ExtensionCodecType<undefined> = (() => {
  const ext = new ExtensionCodec();

  ext.register({
    type: EXT_JAVASCRIPT,
    encode: encodeJavaScriptStructure,
    decode: decodeJavaScriptStructure,
  });

  return ext;
})();
