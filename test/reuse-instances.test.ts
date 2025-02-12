import { deepStrictEqual } from "assert";
import { Encoder, Decoder, decode } from "../src/index.ts";

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

    context("regression #212", () => {
      it("runs multiple times", () => {
        const encoder = new Encoder();
        const decoder = new Decoder();

        const data1 = {
          isCommunication: false,
          isWarning: false,
          alarmId: "619f65a2774abf00568b7210",
          intervalStart: "2022-05-20T12:00:00.000Z",
          intervalStop: "2022-05-20T13:00:00.000Z",
          triggeredAt: "2022-05-20T13:00:00.000Z",
          component: "someComponent",
          _id: "6287920245a582301475627d",
        };

        const data2 = {
          foo: "bar",
        };

        const arr = [data1, data2];
        const enc = arr.map((x) => [x, encoder.encode(x)] as const);

        enc.forEach(([orig, acc]) => {
          const des = decoder.decode(acc);
          deepStrictEqual(des, orig);
        });
      });
    });

    context("Encoder#encodeSharedRef()", () => {
      it("returns the shared reference", () => {
        const encoder = new Encoder();

        const a = encoder.encodeSharedRef(true);
        const b = encoder.encodeSharedRef(false);

        deepStrictEqual(decode(a), decode(b)); // yes, this is the expected behavior
        deepStrictEqual(a.buffer, b.buffer);
      });
    });
  });
});
