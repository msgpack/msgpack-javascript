import assert from "assert";
import { encode, decode } from "@msgpack/msgpack";

describe("encode", () => {
  context("sortKeys", () => {
    it("canonicalizes encoded binaries", () => {
      assert.deepStrictEqual(encode({ a: 1, b: 2 }, { sortKeys: true }), encode({ b: 2, a: 1 }, { sortKeys: true }));
    });
  });

  context("preferFloat32", () => {
    it("encodes numbers in float64 wihout preferFloat32", () => {
      assert.deepStrictEqual(encode(3.14), Uint8Array.from([0xcb, 0x40, 0x9, 0x1e, 0xb8, 0x51, 0xeb, 0x85, 0x1f]));
    });

    it("encodes numbers in float32 when preferFloate32=true", () => {
      assert.deepStrictEqual(encode(3.14, { preferFloat32: true }), Uint8Array.from([0xca, 0x40, 0x48, 0xf5, 0xc3]));
    });

    it("encodes numbers in float64 with preferFloat32=false", () => {
      assert.deepStrictEqual(
        encode(3.14, { preferFloat32: false }),
        Uint8Array.from([0xcb, 0x40, 0x9, 0x1e, 0xb8, 0x51, 0xeb, 0x85, 0x1f]),
      );
    });
  });

  context("ArrayBuffer as buffer", () => {
    const buffer = encode([1, 2, 3]);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteLength);
    assert.deepStrictEqual(decode(arrayBuffer), decode(buffer));
  });
});
