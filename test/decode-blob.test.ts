import assert from "assert";
import "web-streams-polyfill";
import { encode, decode, decodeAsync } from "@msgpack/msgpack";

const MyBlob = typeof Blob !== "undefined" ? Blob : require("blob-polyfill").Blob;

describe("Blob", () => {
  it("decodes it with `decode()`", async () => {
    const blob = new MyBlob([encode("Hello!")]);
    assert.deepStrictEqual(decode(await blob.arrayBuffer()), "Hello!");
  });

  it("decodes it with `decodeAsync()`", async () => {
    const blob = new MyBlob([encode("Hello!")]);
    assert.deepStrictEqual(await decodeAsync(blob.stream()), "Hello!");
  });
});
