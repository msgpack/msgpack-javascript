import { deepStrictEqual } from "assert";
import { Encoder, Decoder } from "@msgpack/msgpack";

const createStream = async function* (...args: any) {
  for (const item of args) {
    yield item;
  }
};

describe("shared instances", () => {
  context("encode() and decodeSync()", () => {
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
      deepStrictEqual(decoder.decode(encoded), object);
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
      deepStrictEqual(decoder.decode(encoded), object);
    });
  });

  context("encode() and decodeAsync()", () => {
    const encoder = new Encoder(undefined);
    const decoder = new Decoder(undefined);

    it("runs #1", async () => {
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
      deepStrictEqual(await decoder.decodeAsync(createStream(encoded)), object);
    });

    it("runs #2", async () => {
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
      deepStrictEqual(await decoder.decodeAsync(createStream(encoded)), object);
    });
  });

  context("encode() and decodeStream()", () => {
    const encoder = new Encoder(undefined);
    const decoder = new Decoder(undefined);

    it("runs #1", async () => {
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
      const a: Array<any> = [];
      for await (const item of decoder.decodeStream(createStream(encoded))) {
        a.push(item);
      }
      deepStrictEqual(a, [object]);
    });

    it("runs #2", async () => {
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
      const a: Array<any> = [];
      for await (const item of decoder.decodeStream(createStream(encoded))) {
        a.push(item);
      }
      deepStrictEqual(a, [object]);
    });
  });

  context("encode() and decodeArrayStream()", () => {
    const encoder = new Encoder(undefined);
    const decoder = new Decoder(undefined);

    it("runs #1", async () => {
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

      const encoded: Uint8Array = encoder.encode([object]);
      const a: Array<any> = [];
      for await (const item of decoder.decodeStream(createStream(encoded))) {
        a.push(item);
      }
      deepStrictEqual(a, [[object]]);
    });

    it("runs #2", async () => {
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

      const encoded: Uint8Array = encoder.encode([object]);
      const a: Array<any> = [];
      for await (const item of decoder.decodeStream(createStream(encoded))) {
        a.push(item);
      }
      deepStrictEqual(a, [[object]]);
    });
  });
});
