import { deepStrictEqual } from "assert";
import { encode, decode } from "../src/index.ts";

describe("README", () => {
  context("64-bit integer map keys", () => {
    it("retains every digit of a uint64 key beyond Number.MAX_SAFE_INTEGER", () => {
      const encoded = Uint8Array.of(0x81, 0xcf, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0xc0);
      const object = decode(encoded, {
        useBigInt64: true,
        mapKeyConverter(key) {
          if (typeof key === "bigint") {
            return key.toString();
          }
          if (typeof key === "string" || typeof key === "number") {
            return key;
          }
          throw new TypeError("Expected a string, number, or bigint map key");
        },
      });
      const expectedKey = "9007199254740993";
      deepStrictEqual(object, { [expectedKey]: null });
    });
  });

  context("## Synopsis", () => {
    it("runs", () => {
      const object = {
        nil: null,
        integer: 1,
        float: Math.PI,
        string: "Hello, world!",
        binary: Uint8Array.from([1, 2, 3]),
        array: [10, 20, 30],
        map: { foo: "bar" },
        timestampExt: new Date(),
      };

      const encoded = encode(object);
      // encoded is an Uint8Array instance

      deepStrictEqual(decode(encoded), object);
    });
  });
});
