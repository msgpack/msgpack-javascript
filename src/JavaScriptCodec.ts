import { ExtensionCodec, ExtensionCodecType } from "./ExtensionCodec";
import { encode } from "./encode";
import { decode } from "./decode";

export const JavaScriptCodecType = 0;

const enum JSData {
  Map,
  Set,
  Date,
  RegExp,
}

export function encodeJavaScriptData(input: unknown): Uint8Array | null {
  if (input instanceof Map) {
    return encode([JSData.Map, [...input]]);
  } else if (input instanceof Set) {
    return encode([JSData.Set, [...input]]);
  } else if (input instanceof Date) {
    // Not a MessagePack timestamp because
    // it may be overrided by users
    return encode([JSData.Date, input.getTime()]);
  } else if (input instanceof RegExp) {
    return encode([JSData.RegExp, [input.source, input.flags]]);
  } else {
    return null;
  }
}

export function decodeJavaScriptData(data: Uint8Array) {
  const [jsDataType, source] = decode(data) as [JSData, any];

  switch (jsDataType) {
    case JSData.Map: {
      return new Map<unknown, unknown>(source);
    }
    case JSData.Set: {
      return new Set<unknown>(source);
    }
    case JSData.Date: {
      return new Date(source);
    }
    case JSData.RegExp: {
      const [pattern, flags] = source;
      return new RegExp(pattern, flags);
    }
    default: {
      throw new Error(`Unknown data type: ${jsDataType}`);
    }
  }
}

export const JavaScriptCodec: ExtensionCodecType = (() => {
  const ext = new ExtensionCodec();

  ext.register({
    type: JavaScriptCodecType,
    encode: encodeJavaScriptData,
    decode: decodeJavaScriptData,
  });

  return ext;
})();
