import assert from "assert";
import { encode, decodeMultiStream } from "../src/index.ts";

describe("decodeStream", () => {
  it("decodes stream", async () => {
    const items = [
      "foo",
      10,
      {
        name: "bar",
      },
      [1, 2, 3],
    ];

    const createStream = async function* (): AsyncGenerator<Uint8Array> {
      for (const item of items) {
        yield encode(item);
      }
    };

    const result: Array<unknown> = [];

    for await (const item of decodeMultiStream(createStream())) {
      result.push(item);
    }

    assert.deepStrictEqual(result, items);
  });

  it("decodes multiple objects in a single binary stream", async () => {
    const items = [
      "foo",
      10,
      {
        name: "bar",
      },
      [1, 2, 3],
    ];

    const encodedItems = items.map((item) => encode(item));
    const encoded = new Uint8Array(encodedItems.reduce((p, c) => p + c.byteLength, 0));
    let offset = 0;
    for (const encodedItem of encodedItems) {
      encoded.set(encodedItem, offset);
      offset += encodedItem.byteLength;
    }

    const createStream = async function* (): AsyncGenerator<Uint8Array> {
      yield encoded;
    };

    const result: Array<unknown> = [];

    for await (const item of decodeMultiStream(createStream())) {
      result.push(item);
    }

    assert.deepStrictEqual(result, items);
  });
});
