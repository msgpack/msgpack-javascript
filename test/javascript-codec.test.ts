import assert from "assert";
import { encode, decode } from "@msgpack/msgpack";
import { JavaScriptCodec } from "src/JavaScriptCodec";

describe("JavaScriptCodec", () => {
  context("mixed", () => {
    // this data comes from https://github.com/yahoo/serialize-javascript

    it("encodes and decodes the object", () => {
      const object = {
        str: "string",
        num: 0,
        obj: { foo: "foo", bar: "bar" },
        arr: [1, 2, 3],
        bool: true,
        nil: null,
        // undef: undefined, // not supported
        date: new Date("Thu, 28 Apr 2016 22:02:17 GMT"),
        map: new Map([["foo", 10], ["bar", 20]]),
        set: new Set([123, 456]),
        regexp: /foo\n/i,
        bigint: typeof(BigInt) !== "undefined" ? BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1) : null,
      };
      const encoded = encode(object, { extensionCodec: JavaScriptCodec });

      assert.deepStrictEqual(decode(encoded, { extensionCodec: JavaScriptCodec }), object);
    });
  });
});
