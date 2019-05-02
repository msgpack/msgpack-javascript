import assert from "assert";
import util from "util";
import { encode, decode } from "../src";

const TIME = 1556636810389;

const SPECS = {
  ZERO: new Date(0),
  TIME_BEFORE_EPOCH_NS: new Date(-1),
  TIME_BEFORE_EPOCH_SEC: new Date(-1000),
  TIME_BEFORE_EPOCH_SEC_AND_NS: new Date(-1002),
  TIMESTAMP32: new Date(Math.floor(TIME / 1000) * 1000),
  TIMESTAMP64: new Date(TIME),
  TIMESTAMP96_SEC_OVER_UINT32: new Date(0x400000000 * 1000),
  TIMESTAMP96_SEC_OVER_UINT32_WITH_NS: new Date(0x400000000 * 1000 + 2),

  ISSUE_WITH_SYNOPSIS: new Date(1556799054803),
} as Record<string, Date>;

describe("codec: timestamp 32/64/96", () => {
  for (const name of Object.keys(SPECS)) {
    const value = SPECS[name];

    it(`encodes and decodes ${name} (${value.toISOString()})`, () => {
      const encoded = encode(value);
      assert.deepStrictEqual(decode(encoded), value, `encoded: ${util.inspect(Buffer.from(encoded))}`);
    });
  }
});
