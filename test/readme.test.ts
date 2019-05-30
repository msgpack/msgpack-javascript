import { deepStrictEqual } from "assert";
import { encode, decode, decodeAsync } from "@msgpack/msgpack";
import { asyncIterableFromStream } from "../src/utils/stream";

describe("README", () => {
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

  context("## ReadableStream", () => {
    before(function() {
      if (typeof ReadableStream === "undefined") {
        this.skip();
      }
    });

    it("reads from stream", async () => {
      const data = [1, 2, 3];
      const encoded = encode(data);
      const stream = new ReadableStream({
        start(controller) {
          for (const byte of encoded) {
            controller.enqueue([byte]);
          }
          controller.close();
        },
      });

      deepStrictEqual(await decodeAsync(asyncIterableFromStream(stream)), data);
    });
  });
});
