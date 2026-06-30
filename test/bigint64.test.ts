import assert from "assert";
import { encode, decode } from "../src/index.ts";

describe("useBigInt64: true", () => {
  before(function () {
    if (typeof BigInt === "undefined") {
      this.skip();
    }
  });

  it("encodes and decodes 0n", () => {
    const value = BigInt(0);
    const encoded = encode(value, { useBigInt64: true });
    assert.deepStrictEqual(decode(encoded, { useBigInt64: true }), value);
  });

  it("encodes and decodes MAX_SAFE_INTEGER+1", () => {
    const value = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    const encoded = encode(value, { useBigInt64: true });
    assert.deepStrictEqual(decode(encoded, { useBigInt64: true }), value);
  });

  it("encodes and decodes MIN_SAFE_INTEGER-1", () => {
    const value = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1);
    const encoded = encode(value, { useBigInt64: true });
    assert.deepStrictEqual(decode(encoded, { useBigInt64: true }), value);
  });

  it("encodes and decodes values with numbers and bigints", () => {
    const value = {
      ints: [0, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
      nums: [Number.NaN, Math.PI, Math.E, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      bigints: [BigInt(0), BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1), BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1)],
    };
    const encoded = encode(value, { useBigInt64: true });
    assert.deepStrictEqual(decode(encoded, { useBigInt64: true }), value);
  });

  it("round-trips the boundary values of int64/uint64", () => {
    const values = [
      BigInt(0),
      BigInt(42),
      BigInt(2) ** BigInt(63) - BigInt(1), // max int64
      -(BigInt(2) ** BigInt(63)), // min int64
      BigInt(2) ** BigInt(64) - BigInt(1), // max uint64
    ];
    for (const value of values) {
      const encoded = encode(value, { useBigInt64: true });
      assert.deepStrictEqual(decode(encoded, { useBigInt64: true }), value);
    }
  });

  it("throws when a bigint is out of the int64/uint64 range", () => {
    const values = [
      BigInt(2) ** BigInt(64), // uint64 max + 1
      BigInt(2) ** BigInt(64) + BigInt(1),
      -(BigInt(2) ** BigInt(63)) - BigInt(1), // int64 min - 1
      -(BigInt(2) ** BigInt(100)),
    ];
    for (const value of values) {
      assert.throws(() => encode(value, { useBigInt64: true }), /out of range/);
    }
  });
});
