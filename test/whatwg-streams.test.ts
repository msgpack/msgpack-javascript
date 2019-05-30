import { deepStrictEqual } from "assert";
import { decodeAsync, encode, decodeArrayStream } from "@msgpack/msgpack";
import { constants } from "http2";

describe("whatwg streams", () => {
  before(function() {
    if (typeof ReadableStream === "undefined") {
      this.skip();
    }
  });

  context("decodeAsync", async () => {
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

    const items = [];
    for await (const item of decodeArrayStream(stream)) {
      items.push(item);
    }
    deepStrictEqual(items, data);
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

    deepStrictEqual(await decodeAsync(stream), data);
  });
});
