import assert from "assert";
import { encode, decode, JavaScriptCodec } from "@msgpack/msgpack";

describe("JavaScriptCodec", () => {
  context("mixed", () => {
    it("encodes and decodes structured data", () => {
      const object = {
        // basic
        str: "string",
        num: 0,
        obj: { foo: "foo", bar: "bar" },
        arr: [1, 2, 3],
        bool: true,
        nil: null,

        // JavaScript structures
        date: new Date("Thu, 28 Apr 2016 22:02:17 GMT"),
        regexp: /foo\n/i,
        arrayBuffer: Uint8Array.from([0, 1, 2, 0xff]).buffer,
        int8Array: Int8Array.from([0, 1, 2, 0xff]),
        uint8ClampedArray: Uint8ClampedArray.from([0, 1, 2, 0xff]),
        int16Array: Int16Array.from([0, 1, 2, 0xffff]),
        uint16Array: Uint16Array.from([0, 1, 2, -1]),
        int32Array: Int32Array.from([0, 1, 2, 0xffff]),
        uint32Array: Uint32Array.from([0, 1, 2, -1]),
        float32Array: Float32Array.from([0, 1, 2, Math.PI, Math.E]),
        float64Array: Float64Array.from([0, 1, 2, Math.PI, Math.E]),
        map: new Map([["foo", 10], ["bar", 20]]),
        set: new Set([123, 456]),
      };
      const encoded = encode(object, { extensionCodec: JavaScriptCodec });
      assert.deepStrictEqual(decode(encoded, { extensionCodec: JavaScriptCodec }), object);
    });
  });

  context("bigint and its family", () => {
    it("encodes and decodes structured data", function () {
      if (typeof BigInt === "undefined" || typeof BigInt64Array === "undefined" || typeof BigUint64Array === "undefined") {
        this.skip();
      }

      const object = {
        bigint: BigInt(42),
        bigintArray: [BigInt(42)],

        // TODO:
        //bigInt64array: BigInt64Array.from([BigInt(0), BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1)]),
        //bigUint64array: BigUint64Array.from([BigInt(0), BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)]),
      };
      const encoded = encode(object, { extensionCodec: JavaScriptCodec });
      assert.deepStrictEqual(decode(encoded, { extensionCodec: JavaScriptCodec }), object);
    });
  });
});
