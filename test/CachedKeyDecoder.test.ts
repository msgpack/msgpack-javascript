import assert from "assert";
import { CachedKeyDecoder } from "../src/CachedKeyDecoder.ts";
import { utf8EncodeJs, utf8Count } from "../src/utils/utf8.ts";
import type { KeyDecoder } from "../src/CachedKeyDecoder.ts";

function tryDecode(keyDecoder: KeyDecoder, str: string): string {
  const byteLength = utf8Count(str);
  const bytes = new Uint8Array(byteLength);
  utf8EncodeJs(str, bytes, 0);
  if (!keyDecoder.canBeCached(byteLength)) {
    throw new Error("Unexpected precondition");
  }
  return keyDecoder.decode(bytes, 0, byteLength);
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
      const decoder = new CachedKeyDecoder(16, 4);

      for (let i = 0; i < 100; i++) {
        assert.deepStrictEqual(tryDecode(decoder, "foo1"), "foo1");
        assert.deepStrictEqual(tryDecode(decoder, "foo2"), "foo2");
        assert.deepStrictEqual(tryDecode(decoder, "foo3"), "foo3");
        assert.deepStrictEqual(tryDecode(decoder, "foo4"), "foo4");
        assert.deepStrictEqual(tryDecode(decoder, "foo5"), "foo5");
      }

      // console.dir(decoder, { depth: 100 });
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

      // console.dir(decoder, { depth: 100 });
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
