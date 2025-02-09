import assert from "assert";
import { encode, decode } from "../src/index.ts";
import type { DecoderOptions } from "../src/index.ts";

describe("decode with rawStrings specified", () => {
  const options = { rawStrings: true } satisfies DecoderOptions;

  it("decodes string as binary", () => {
    const actual = decode(encode("foo"), options);
    const expected = Uint8Array.from([0x66, 0x6f, 0x6f]);
    assert.deepStrictEqual(actual, expected);
  });

  it("decodes invalid UTF-8 string as binary", () => {
    const invalidUtf8String = Uint8Array.from([
      61, 180, 118, 220, 39, 166, 43, 68, 219, 116, 105, 84, 121, 46, 122, 136, 233, 221, 15, 174, 247, 19, 50, 176,
      184, 221, 66, 188, 171, 36, 135, 121,
    ]);
    const encoded = Uint8Array.from([
      196, 32, 61, 180, 118, 220, 39, 166, 43, 68, 219, 116, 105, 84, 121, 46, 122, 136, 233, 221, 15, 174, 247, 19, 50,
      176, 184, 221, 66, 188, 171, 36, 135, 121,
    ]);

    const actual = decode(encoded, options);
    assert.deepStrictEqual(actual, invalidUtf8String);
  });

  it("decodes object keys as strings", () => {
    const actual = decode(encode({ key: "foo" }), options);
    const expected = { key: Uint8Array.from([0x66, 0x6f, 0x6f]) };
    assert.deepStrictEqual(actual, expected);
  });

  it("ignores maxStrLength", () => {
    const lengthLimitedOptions = { ...options, maxStrLength: 1 } satisfies DecoderOptions;

    const actual = decode(encode("foo"), lengthLimitedOptions);
    const expected = Uint8Array.from([0x66, 0x6f, 0x6f]);
    assert.deepStrictEqual(actual, expected);
  });

  it("respects maxBinLength", () => {
    const lengthLimitedOptions = { ...options, maxBinLength: 1 } satisfies DecoderOptions;

    assert.throws(() => {
      decode(encode("foo"), lengthLimitedOptions);
    }, /max length exceeded/i);
  });
});
