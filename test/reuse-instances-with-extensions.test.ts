// https://github.com/msgpack/msgpack-javascript/issues/195

import { deepStrictEqual } from "assert";
import { Encoder, Decoder, ExtensionCodec } from "../src/index.ts";

const MSGPACK_EXT_TYPE_BIGINT = 0;

function registerCodecs(context: MsgPackContext) {
  const { extensionCodec, encode, decode } = context;

  extensionCodec.register({
    type: MSGPACK_EXT_TYPE_BIGINT,
    encode: (value) => (typeof value === "bigint" ? encode(value.toString()) : null),
    decode: (data) => BigInt(decode(data) as string),
  });
}

class MsgPackContext {
  readonly encode: (value: unknown) => Uint8Array;
  readonly decode: (buffer: BufferSource | ArrayLike<number>) => unknown;
  readonly extensionCodec = new ExtensionCodec<MsgPackContext>();

  constructor() {
    const encoder = new Encoder({ extensionCodec: this.extensionCodec, context: this });
    const decoder = new Decoder({ extensionCodec: this.extensionCodec, context: this });

    this.encode = encoder.encode.bind(encoder);
    this.decode = decoder.decode.bind(decoder);

    registerCodecs(this);
  }
}

describe("reuse instances with extensions", () => {
  it("should encode and decode a bigint", () => {
    const context = new MsgPackContext();
    const buf = context.encode(BigInt(42));
    const data = context.decode(buf);
    deepStrictEqual(data, BigInt(42));
  });

  it("should encode and decode bigints", () => {
    const context = new MsgPackContext();
    const buf = context.encode([BigInt(1), BigInt(2), BigInt(3)]);
    const data = context.decode(buf);
    deepStrictEqual(data, [BigInt(1), BigInt(2), BigInt(3)]);
  });

  it("keeps mapKeyConverter for maps decoded re-entrantly inside an extension", () => {
    const MSGPACK_EXT_TYPE_WRAP = 1;
    const extensionCodec = new ExtensionCodec();
    const encoder = new Encoder({ extensionCodec });
    const decoder = new Decoder({ extensionCodec, mapKeyConverter: (key) => String(key).toUpperCase() });

    class Wrapped {
      readonly inner: unknown;
      constructor(inner: unknown) {
        this.inner = inner;
      }
    }
    extensionCodec.register({
      type: MSGPACK_EXT_TYPE_WRAP,
      encode: (value) => (value instanceof Wrapped ? encoder.encode(value.inner) : null),
      // decode re-enters the same decoder instance, which triggers Decoder#clone()
      decode: (data) => new Wrapped(decoder.decode(data)),
    });

    const buf = encoder.encode({ a: 1, nested: new Wrapped({ b: 2 }) });
    const decoded = decoder.decode(buf) as Record<string, Wrapped>;

    // The nested map is decoded on the cloned decoder; it must use the same converter.
    deepStrictEqual(Object.keys(decoded), ["A", "NESTED"]);
    deepStrictEqual(decoded["NESTED"]!.inner, { B: 2 });
  });
});
