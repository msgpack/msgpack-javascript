import assert from "assert";
import { encodeInt64, decodeInt64, encodeInt32, decodeInt32 } from "../src/utils/int";

const INT32SPECS = {
  ZERO: 0,
  ONE: 1,
  MINUS_ONE: -1,
  X_FF: 0xff,
  MINUS_X_FF: -0xff,
  INT32_MAX: 0x7fffffff,
  INT32_MIN: -0x7fffffff - 1,
} as Record<string, number>;

const INT64SPECS = {
  ...INT32SPECS,
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
} as Record<string, number>;

describe("codec: encode and decode int 32/64", () => {
  context("int 32", () => {
    for (const name of Object.keys(INT32SPECS)) {
      const value = INT32SPECS[name];

      it(`${value} (${value < 0 ? "-" : ""}0x${Math.abs(value).toString(16)})`, () => {
        const b: Array<number> = [];
        encodeInt32(b, value);
        assert.deepStrictEqual(decodeInt32(b[0], b[1], b[2], b[3]), value);
      });
    }
  });

  context("int 64", () => {
    for (const name of Object.keys(INT64SPECS)) {
      const value = INT64SPECS[name];

      it(`${value} (${value < 0 ? "-" : ""}0x${Math.abs(value).toString(16)})`, () => {
        const b: Array<number> = [];
        encodeInt64(b, value);
        assert.deepStrictEqual(decodeInt64(b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7]), value);
      });
    }
  });
});
