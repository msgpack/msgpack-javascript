import { deepStrictEqual } from "assert";
import { Encoder, Decoder } from "@msgpack/msgpack";

describe("shared instances", () => {
  context("Encoder and Decoder", () => {
    const encoder = new Encoder(undefined);
    const decoder = new Decoder(undefined);

    it("runs #1", () => {
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

      const encoded: Uint8Array = encoder.encode(object);
      deepStrictEqual(decoder.decodeSync(encoded), object);
    });

    it("runs #2", () => {
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

      const encoded: Uint8Array = encoder.encode(object);
      deepStrictEqual(decoder.decodeSync(encoded), object);
    });
  });
});
