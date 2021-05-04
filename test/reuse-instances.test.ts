import { deepStrictEqual } from "assert";
import { Encoder, Decoder } from "@msgpack/msgpack";

const createStream = async function* (...args: any) {
  for (const item of args) {
    yield item;
  }
};

const N = 10;

describe("shared instances", () => {
  context("encode() and decodeSync()", () => {
    it("runs multiple times", () => {
      const encoder = new Encoder();
      const decoder = new Decoder();

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

      for (let i = 0; i < N; i++) {
        const encoded: Uint8Array = encoder.encode(object);
        deepStrictEqual(decoder.decode(encoded), object, `#${i}`);
      }
    });
  });

  context("encode() and decodeAsync()", () => {
    it("runs multiple times", async () => {
      const encoder = new Encoder();
      const decoder = new Decoder();

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

      for (let i = 0; i < N; i++) {
        const encoded: Uint8Array = encoder.encode(object);
        deepStrictEqual(await decoder.decodeAsync(createStream(encoded)), object, `#${i}`);
      }
    });
  });

  context("encode() and decodeStream()", () => {
    it("runs multiple times", async () => {
      const encoder = new Encoder();
      const decoder = new Decoder();

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

      for (let i = 0; i < N; i++) {
        const encoded: Uint8Array = encoder.encode(object);
        const a: Array<any> = [];
        for await (const item of decoder.decodeStream(createStream(encoded))) {
          a.push(item);
        }
        deepStrictEqual(a, [object], `#${i}`);
      }
    });
  });

  context("encode() and decodeArrayStream()", () => {
    it("runs multiple times", async () => {
      const encoder = new Encoder();
      const decoder = new Decoder();

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

      for (let i = 0; i < N; i++) {
        const encoded: Uint8Array = encoder.encode([object]);
        const a: Array<any> = [];
        for await (const item of decoder.decodeStream(createStream(encoded))) {
          a.push(item);
        }
        deepStrictEqual(a, [[object]], `#${i}`);
      }
    });
  });
});
