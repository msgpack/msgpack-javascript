import assert from "assert";
import util from "util";
import {
  encode,
  decode,
  encodeDateToTimeSpec,
  decodeTimestampExtension,
  decodeTimestampToTimeSpec,
  encodeTimestampExtension,
} from "../src/index.ts";

const TIME = 1556636810389;

const SPECS = {
  ZERO: new Date(0),
  TIME_BEFORE_EPOCH_NS: new Date(-1),
  TIME_BEFORE_EPOCH_SEC: new Date(-1000),
  TIME_BEFORE_EPOCH_SEC_AND_NS: new Date(-1002),
  TIMESTAMP32: new Date(Math.floor(TIME / 1000) * 1000),
  TIMESTAMP64: new Date(TIME),
  TIMESTAMP64_OVER_INT32: new Date(Date.UTC(2200, 0)), // cf. https://github.com/msgpack/msgpack-ruby/pull/172
  TIMESTAMP96_SEC_OVER_UINT32: new Date(0x400000000 * 1000),
  TIMESTAMP96_SEC_OVER_UINT32_WITH_NS: new Date(0x400000000 * 1000 + 2),

  REGRESSION_1: new Date(1556799054803),
} as Record<string, Date>;

describe("codec: timestamp 32/64/96", () => {
  context("encode / decode", () => {
    for (const name of Object.keys(SPECS)) {
      const value = SPECS[name]!;

      it(`encodes and decodes ${name} (${value.toISOString()})`, () => {
        const encoded = encode(value);
        assert.deepStrictEqual(decode(encoded), value, `encoded: ${util.inspect(Buffer.from(encoded))}`);
      });
    }
  });

  context("encodeDateToTimeSpec", () => {
    it("normalizes new Date(-1) to { sec: -1, nsec: 999000000 }", () => {
      assert.deepStrictEqual(encodeDateToTimeSpec(new Date(-1)), { sec: -1, nsec: 999000000 });
    });
  });

  context("encodeDateToTimeSpec", () => {
    it("decodes timestamp-ext binary to TimeSpec", () => {
      const encoded = encodeTimestampExtension(new Date(42000))!;
      assert.deepStrictEqual(decodeTimestampToTimeSpec(encoded), { sec: 42, nsec: 0 });
    });
  });

  context("decodeTimestampExtension", () => {
    context("for broken data", () => {
      it("throws errors", () => {
        assert.throws(() => {
          decodeTimestampExtension(Uint8Array.from([0]));
        }, /unrecognized data size for timestamp/i);
      });
    });
  });
});
