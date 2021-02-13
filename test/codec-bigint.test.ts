import assert from "assert";
import { encode, decode, ExtensionCodec } from "../src";

const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: 0,
  encode: (input: unknown) => {
    if (typeof input === "bigint") {
      return encode(input.toString());
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    return BigInt(decode(data));
  },
});

describe("codec BigInt", () => {
  before(function () {
    if (typeof BigInt === "undefined") {
      this.skip();
    }
  });

  it("encodes and decodes 0n", () => {
    const value = BigInt(0);
    const encoded = encode(value, { extensionCodec });
    assert.deepStrictEqual(decode(encoded, { extensionCodec }), value);
  });

  it("encodes and decodes MAX_SAFE_INTEGER+1", () => {
    const value = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    const encoded = encode(value, { extensionCodec });
    assert.deepStrictEqual(decode(encoded, { extensionCodec }), value);
  });

  it("encodes and decodes MIN_SAFE_INTEGER-1", () => {
    const value = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1);
    const encoded = encode(value, { extensionCodec });
    assert.deepStrictEqual(decode(encoded, { extensionCodec }), value);
  });
});
