import { deepStrictEqual } from "assert";
import { decodeAsync, encode, decodeArrayStream } from "@msgpack/msgpack";

const isReadableStreamConstructorAvailable: boolean = (() => {
  try {
    // Edge <= 18 has ReadableStream but its constructor is not available
    new ReadableStream({
      start() {},
    });
    return true;
  } catch {
    return false;
  }
})();

describe("whatwg streams", () => {
  before(function() {
    if (!isReadableStreamConstructorAvailable) {
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
