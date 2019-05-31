import { deepStrictEqual } from "assert";
import { decodeAsync, encode, decodeArrayStream } from "@msgpack/msgpack";

describe("whatwg streams", () => {
  before(function() {
    // Edge <= 18 has no ReadableStream constructor
    if (typeof ReadableStream !== "function") {
      this.skip();
    }
  });

  it("decodeAsync", async () => {
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

    const items: Array<unknown> = [];
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
