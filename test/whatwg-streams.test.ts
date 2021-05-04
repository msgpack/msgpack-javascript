import { deepStrictEqual } from "assert";
import { decodeAsync, encode, decodeArrayStream } from "@msgpack/msgpack";
import { ReadableStream as PonyReadableStream } from "web-streams-polyfill/ponyfill";
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

const MyReadableStream = isReadableStreamConstructorAvailable ? ReadableStream : PonyReadableStream;

// Downgrade stream not to implement AsyncIterable<T>
function downgradeReadableStream(stream: ReadableStream | PonyReadableStream) {
  (stream as any)[Symbol.asyncIterator] = undefined;
}

describe("whatwg streams", () => {
  it("decodeArrayStream", async () => {
    const data = [1, 2, 3];
    const encoded = encode(data);
    const stream = new MyReadableStream({
      start(controller) {
        for (const byte of encoded) {
          controller.enqueue([byte]);
        }
        controller.close();
      },
    });
    downgradeReadableStream(stream);

    const items: Array<unknown> = [];
    for await (const item of decodeArrayStream(stream)) {
      items.push(item);
    }
    deepStrictEqual(items, data);
  });

  it("decodeAsync", async () => {
    const data = [1, 2, 3];
    const encoded = encode(data);
    const stream = new MyReadableStream({
      start(controller) {
        for (const byte of encoded) {
          controller.enqueue([byte]);
        }
        controller.close();
      },
    });
    downgradeReadableStream(stream);

    deepStrictEqual(await decodeAsync(stream), data);
  });
});
