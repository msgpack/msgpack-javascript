import assert from "assert";
import "web-streams-polyfill";
// @ts-ignore
import b from "blob-polyfill";
import { encode, decode, decodeAsync } from "@msgpack/msgpack";

describe("Blob", () => {
  it("decodes it with `decode()`", async () => {
    const blob = new b.Blob([encode("Hello!")]);
    assert.deepStrictEqual(decode(await blob.arrayBuffer()), "Hello!");
  });

  it("decodes it with `decodeAsync()`", async () => {
    const blob = new b.Blob([encode("Hello!")]);
    assert.deepStrictEqual(await decodeAsync(blob.stream()), "Hello!");
  });
});
