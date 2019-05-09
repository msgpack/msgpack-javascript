import assert from "assert";
import { setInt64, getInt64 } from "../src/utils/int";

const INT64SPECS = {
  ZERO: 0,
  ONE: 1,
  MINUS_ONE: -1,
  X_FF: 0xff,
  MINUS_X_FF: -0xff,
  INT32_MAX: 0x7fffffff,
  INT32_MIN: -0x7fffffff - 1,
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
} as Record<string, number>;

describe("codec: encode and decode int 32/64", () => {
  context("int 64", () => {
    for (const name of Object.keys(INT64SPECS)) {
      const value = INT64SPECS[name];

      it(`${value} (${value < 0 ? "-" : ""}0x${Math.abs(value).toString(16)})`, () => {
        const b = new Uint8Array(8);
        const view = new DataView(b.buffer);
        setInt64(new DataView(b.buffer), 0, value);
        assert.deepStrictEqual(getInt64(view, 0), value);
      });
    }
  });
});
