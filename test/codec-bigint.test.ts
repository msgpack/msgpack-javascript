import assert from "assert";
import { encode, decode, ExtensionCodec, DecodeError } from "../src";

const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: 0,
  encode: (input: unknown) => {
     if (typeof input === "bigint") {
        if (input <= Number.MAX_SAFE_INTEGER && input >= Number.MIN_SAFE_INTEGER) {
            return encode(parseInt(input.toString(), 10));
        } else {
            return encode(input.toString());
        }
     } else {
        return null;
     }
  },
  decode: (data: Uint8Array) => {
    const val = decode(data);
    if (!(typeof val === "string" || typeof val === "number")) {
      throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
    }
    return BigInt(val);
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
