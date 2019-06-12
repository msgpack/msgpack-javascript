import assert from "assert";
import { encode } from "@msgpack/msgpack";

describe("encode options", () => {
  context("sortKeys", () => {
    it("canonicalize encoded binaries", () => {
      assert.deepStrictEqual(
        encode({ a: 1, b: 2 }, { sortKeys: true }),
        encode({ b: 2, a: 1 }, { sortKeys: true }),
      );
    });
  });
});
