import assert from "assert";
import { encode, decode } from "../src/index.ts";

describe("encode", () => {
  context("sortKeys", () => {
    it("cannonicalizes encoded binaries", () => {
      assert.deepStrictEqual(encode({ a: 1, b: 2 }, { sortKeys: true }), encode({ b: 2, a: 1 }, { sortKeys: true }));
    });
  });

  context("forceFloat32", () => {
    it("encodes numbers in float64 without forceFloat32", () => {
      assert.deepStrictEqual(encode(3.14), Uint8Array.from([0xcb, 0x40, 0x9, 0x1e, 0xb8, 0x51, 0xeb, 0x85, 0x1f]));
    });

    it("encodes numbers in float32 when forceFloat32=true", () => {
      assert.deepStrictEqual(encode(3.14, { forceFloat32: true }), Uint8Array.from([0xca, 0x40, 0x48, 0xf5, 0xc3]));
    });

    it("encodes numbers in float64 with forceFloat32=false", () => {
      assert.deepStrictEqual(
        encode(3.14, { forceFloat32: false }),
        Uint8Array.from([0xcb, 0x40, 0x9, 0x1e, 0xb8, 0x51, 0xeb, 0x85, 0x1f]),
      );
    });
  });

  context("forceFloat", () => {
    it("encodes integers as integers without forceIntegerToFloat", () => {
      assert.deepStrictEqual(encode(3), Uint8Array.from([0x3]));
    });

    it("encodes integers as floating point when forceIntegerToFloat=true", () => {
      assert.deepStrictEqual(
        encode(3, { forceIntegerToFloat: true }),
        Uint8Array.from([0xcb, 0x40, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
      );
    });

    it("encodes integers as float32 when forceIntegerToFloat=true and forceFloat32=true", () => {
      assert.deepStrictEqual(
        encode(3, { forceIntegerToFloat: true, forceFloat32: true }),
        Uint8Array.from([0xca, 0x40, 0x40, 0x00, 0x00]),
      );
    });

    it("encodes integers as integers when forceIntegerToFloat=false", () => {
      assert.deepStrictEqual(encode(3, { forceIntegerToFloat: false }), Uint8Array.from([0x3]));
    });
  });

  context("ignoreUndefined", () => {
    it("encodes { foo: undefined } as is by default", () => {
      assert.deepStrictEqual(decode(encode({ foo: undefined, bar: 42 })), { foo: null, bar: 42 });
    });

    it("encodes { foo: undefined } as is with `ignoreUndefined: false`", () => {
      assert.deepStrictEqual(decode(encode({ foo: undefined, bar: 42 }, { ignoreUndefined: false })), {
        foo: null,
        bar: 42,
      });
    });

    it("encodes { foo: undefined } to {} with `ignoreUndefined: true`", () => {
      assert.deepStrictEqual(decode(encode({ foo: undefined, bar: 42 }, { ignoreUndefined: true })), { bar: 42 });
    });
  });

  context("ArrayBuffer as buffer", () => {
    const buffer = encode([1, 2, 3]);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteLength);
    assert.deepStrictEqual(decode(arrayBuffer), decode(buffer));
  });
});
