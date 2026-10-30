import assert from "assert";
import { encode, decodeArrayStream } from "../src/index.ts";

describe("decodeArrayStream", () => {
  const generateSampleObject = () => {
    return {
      id: Math.random(),
      name: "test",
    };
  };

  const createStream = async function* (object: any) {
    for (const byte of encode(object)) {
      yield [byte];
    }
  };

  it("decodes numbers array (array8)", async () => {
    const object = [1, 2, 3, 4, 5];

    const result: Array<unknown> = [];

    for await (const item of decodeArrayStream(createStream(object))) {
      result.push(item);
    }

    assert.deepStrictEqual(object, result);
  });

  it("decodes numbers of array (array16)", async () => {
    const createStream = async function* () {
      yield [0xdc, 0, 3];
      yield encode(1);
      yield encode(2);
      yield encode(3);
    };

    const result: Array<unknown> = [];

    for await (const item of decodeArrayStream(createStream())) {
      result.push(item);
    }

    assert.deepStrictEqual(result, [1, 2, 3]);
  });

  it("decodes numbers of array (array32)", async () => {
    const createStream = async function* () {
      yield [0xdd, 0, 0, 0, 3];
      yield encode(1);
      yield encode(2);
      yield encode(3);
    };

    const result: Array<unknown> = [];

    for await (const item of decodeArrayStream(createStream())) {
      result.push(item);
    }

    assert.deepStrictEqual(result, [1, 2, 3]);
  });

  for (const [name, header] of [
    ["array16", [0xdc, 0, 1]],
    ["array32", [0xdd, 0, 0, 0, 1]],
  ] as const) {
    it(`decodes ${name} split at every header boundary`, async () => {
      const object = { nested: [1, "value", null] };
      const encoded = Uint8Array.from([...header, ...encode(object)]);

      for (let split = 1; split < header.length; split++) {
        const stream = async function* () {
          yield encoded.subarray(0, split);
          yield encoded.subarray(split);
        };
        const result: Array<unknown> = [];
        for await (const item of decodeArrayStream(stream())) {
          result.push(item);
        }
        assert.deepStrictEqual(result, [object], `split at ${split}`);
      }
    });

    it(`rejects ${name} truncated in the header`, async () => {
      for (let length = 1; length < header.length; length++) {
        const stream = async function* () {
          yield header.slice(0, length);
          yield new Uint8Array(0);
        };
        await assert.rejects(decodeArrayStream(stream()).next(), RangeError);
      }
    });

    it(`decodes ${name} byte-by-byte with empty chunks`, async () => {
      const object = { nested: [1, "value", null] };
      const encoded = Uint8Array.from([...header, ...encode(object)]);
      const stream = async function* () {
        for (const byte of encoded) {
          yield new Uint8Array(0);
          yield Uint8Array.from([0xff, byte, 0xff]).subarray(1, 2);
        }
      };
      const result: Array<unknown> = [];
      for await (const item of decodeArrayStream(stream())) {
        result.push(item);
      }
      assert.deepStrictEqual(result, [object]);
    });
  }

  it("decodes objects array", async () => {
    const objectsArrays: Array<any> = [];

    for (let i = 0; i < 10; i++) {
      objectsArrays.push(generateSampleObject());
    }

    const result: Array<unknown> = [];

    for await (const item of decodeArrayStream(createStream(objectsArrays))) {
      result.push(item);
    }

    assert.deepStrictEqual(objectsArrays, result);
  });

  it("fails for non array input", async () => {
    const object = "demo";

    await assert.rejects(async () => {
      const result: Array<unknown> = [];

      for await (const item of decodeArrayStream(createStream(object))) {
        result.push(item);
      }
    }, /.*Unrecognized array type byte:.*/i);
  });
});
