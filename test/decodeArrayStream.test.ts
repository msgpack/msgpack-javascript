import assert from "assert";
import { encode, decodeAsync, decodeArrayStream } from "../src";

describe("decodeArrayStream", () => {
  const generateSampleObject = () => {
    return {
      id: Math.random(),
      name: "test",
    };
  };

  const createStream = async function*(object: any) {
    for (const byte of encode(object)) {
      yield [byte];
    }
  };

  it("decodes numbers array", async () => {
    const object = [1, 2, 3, 4, 5];

    const result = [];

    for await (let item of decodeArrayStream(createStream(object))) {
      result.push(item);
    }

    assert.deepStrictEqual(object, result);
  });

  it("decodes objects array", async () => {
    const objectsArrays: Array<any> = [];

    for (let i = 0; i < 10; i++) {
      objectsArrays.push(generateSampleObject());
    }

    const result = [];

    for await (let item of decodeArrayStream(createStream(objectsArrays))) {
      result.push(item);
    }

    assert.deepStrictEqual(objectsArrays, result);
  });

  it("fails for non array input", async () => {
    const object = "demo";

    let error: Error | null = null;

    try {
      const result = [];

      for await (let item of decodeArrayStream(createStream(object))) {
        result.push(item);
      }
    } catch (e) {
      error = e;
    }

    assert.notStrictEqual(error, null);
  });
});
