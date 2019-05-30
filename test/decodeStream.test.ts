import assert from "assert";
import { encode } from "../src";
import { decodeStream } from "../src/decodeAsync";

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

    const createStream = async function*() {
      for (const item of items) {
        yield encode(item);
      }
    };

    const result = [];

    for await (const item of decodeStream(createStream())) {
      result.push(item);
    }

    assert.deepStrictEqual(result, items);
  });
});
