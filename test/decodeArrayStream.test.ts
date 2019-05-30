import assert from "assert";
import { encode, decodeArrayStream } from "../src";

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

    const result: Array<unknown> = [];

    for await (const item of decodeArrayStream(createStream(object))) {
      result.push(item);
    }

    assert.deepStrictEqual(object, result);
  });

  it("decodes objects array", async () => {
    const objectsArrays: Array<any> = [];

    for (let i = 0; i < 10; i++) {
      objectsArrays.push(generateSampleObject());
    }

    const result: Array<unknown> = [];

    for await (let item of decodeArrayStream(createStream(objectsArrays))) {
      result.push(item);
    }

    assert.deepStrictEqual(objectsArrays, result);
  });

  it("fails for non array input", async () => {
    const object = "demo";

    await assert.rejects(async () => {
      const result: Array<unknown> = [];

      for await (let item of decodeArrayStream(createStream(object))) {
        result.push(item);
      }
    }, /.*Unrecognized array type byte:.*/i);
  });
});
