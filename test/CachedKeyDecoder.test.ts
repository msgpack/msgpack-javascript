import assert from "assert";
import { CachedKeyDecoder } from "../src/CachedKeyDecoder";
import { utf8EncodeJs, utf8Count } from "../src/utils/utf8";

function tryDecode(decoder: CachedKeyDecoder, str: string): string {
  const byteLength = utf8Count(str);
  const bytes = new Uint8Array(byteLength);
  utf8EncodeJs(str, bytes, 0);
  if (!decoder.canBeCached(byteLength)) {
    throw new Error("Unexpected precondition");
  }
  return decoder.decode(bytes, 0, byteLength);
}

describe("CachedKeyDecoder", () => {
  context("basic behavior", () => {
    it("decodes a string", () => {
      const decoder = new CachedKeyDecoder();

      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");
      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");
      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");

      // console.dir(decoder, { depth: 100 });
    });

    it("decodes strings", () => {
      const decoder = new CachedKeyDecoder();

      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");
      assert.deepStrictEqual(tryDecode(decoder, "bar"), "bar");
      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");

      // console.dir(decoder, { depth: 100 });
    });

    it("decodes strings with purging records", () => {
      const decoder = new CachedKeyDecoder(16, 2);

      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");
      assert.deepStrictEqual(tryDecode(decoder, "bar"), "bar");

      // the next `tryDecode()` should purge the cache of "foo"
      assert.deepStrictEqual(tryDecode(decoder, "baz"), "baz");

      // with newly created an internal cache record
      assert.deepStrictEqual(tryDecode(decoder, "foo"), "foo");
    });
  });

  context("edge cases", () => {
    // len=0 is not supported because it is just an empty string
    it("decodes str with len=1", () => {
      const decoder = new CachedKeyDecoder();

      assert.deepStrictEqual(tryDecode(decoder, "f"), "f");
      assert.deepStrictEqual(tryDecode(decoder, "a"), "a");
      assert.deepStrictEqual(tryDecode(decoder, "f"), "f");
      assert.deepStrictEqual(tryDecode(decoder, "a"), "a");

      //console.dir(decoder, { depth: 100 });
    });

    it("decodes str with len=maxKeyLength", () => {
      const decoder = new CachedKeyDecoder(1);

      assert.deepStrictEqual(tryDecode(decoder, "f"), "f");
      assert.deepStrictEqual(tryDecode(decoder, "a"), "a");
      assert.deepStrictEqual(tryDecode(decoder, "f"), "f");
      assert.deepStrictEqual(tryDecode(decoder, "a"), "a");

      //console.dir(decoder, { depth: 100 });
    });
  });
});
