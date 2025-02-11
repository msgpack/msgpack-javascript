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
});
