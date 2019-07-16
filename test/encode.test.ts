import assert from "assert";
import { encode, decode } from "@msgpack/msgpack";

describe("encode", () => {
  context("sortKeys", () => {
    it("canonicalize encoded binaries", () => {
      assert.deepStrictEqual(encode({ a: 1, b: 2 }, { sortKeys: true }), encode({ b: 2, a: 1 }, { sortKeys: true }));
    });
  });

  context("ArrayBuffer as buffer", () => {
    const buffer = encode([1, 2, 3]);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteLength);
    assert.deepStrictEqual(decode(arrayBuffer), decode(buffer));
  });
});
