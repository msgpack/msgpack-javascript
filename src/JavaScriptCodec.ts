import { ExtensionCodec, ExtensionCodecType } from "./ExtensionCodec";
import { encode } from "./encode";
import { decode } from "./decode";

export const JavaScriptCodecType = 0;

export function encodeJavaScriptData(input: unknown): Uint8Array | null {
  if (input instanceof Map) {
    return encode(["Map", [...input]]);
  } else if (input instanceof Set) {
    return encode(["Set", [...input]]);
  } else if (input instanceof Date) {
    // Not a MessagePack timestamp because
    // it may be overrided by users
    return encode(["Date", input.getTime()]);
  } else if (input instanceof RegExp) {
    return encode(["RegExp", [input.source, input.flags]]);
  } else {
    return null;
  }
}

export function decodeJavaScriptData(data: Uint8Array) {
  const [constructor, source] = decode(data) as [string, any];

  switch (constructor) {
    case "undefined": {
      return undefined;
    }
    case "Map": {
      return new Map<unknown, unknown>(source);
    }
    case "Set": {
      return new Set<unknown>(source);
    }
    case "Date": {
      return new Date(source);
    }
    case "RegExp": {
      const [pattern, flags] = source;
      return new RegExp(pattern, flags);
    }
    default: {
      throw new Error(`Unknown constructor: ${constructor}`);
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
