import assert from "assert";
import { encode, decode, decodeAsync } from "../src/index.ts";
import type { DecoderOptions } from "../src/index.ts";

describe("decode with max${Type}Length specified", () => {
  async function* createStream<T>(input: T) {
    yield input;
  }

  context("maxStrLength", () => {
    const input = encode("foo");
    const options = { maxStrLength: 1 } satisfies DecoderOptions;

    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode(input, options);
      }, /max length exceeded/i);
    });

    it("throws errors (asynchronous)", async () => {
      await assert.rejects(async () => {
        await decodeAsync(createStream(input), options);
      }, /max length exceeded/i);
    });
  });

  context("maxBinLength", () => {
    const input = encode(Uint8Array.from([1, 2, 3]));
    const options = { maxBinLength: 1 } satisfies DecoderOptions;

    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode(input, options);
      }, /max length exceeded/i);
    });

    it("throws errors (asynchronous)", async () => {
      await assert.rejects(async () => {
        await decodeAsync(createStream(input), options);
      }, /max length exceeded/i);
    });
  });

  context("maxArrayLength", () => {
    const input = encode([1, 2, 3]);
    const options = { maxArrayLength: 1 } satisfies DecoderOptions;

    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode(input, options);
      }, /max length exceeded/i);
    });

    it("throws errors (asynchronous)", async () => {
      await assert.rejects(async () => {
        await decodeAsync(createStream(input), options);
      }, /max length exceeded/i);
    });
  });

  context("maxMapLength", () => {
    const input = encode({ foo: 1, bar: 1, baz: 3 });
    const options = { maxMapLength: 1 } satisfies DecoderOptions;

    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode(input, options);
      }, /max length exceeded/i);
    });

    it("throws errors (asynchronous)", async () => {
      await assert.rejects(async () => {
        await decodeAsync(createStream(input), options);
      }, /max length exceeded/i);
    });
  });

  context("maxExtType", () => {
    const input = encode(new Date());
    // timextamp ext requires at least 4 bytes.
    const options = { maxExtLength: 1 } satisfies DecoderOptions;

    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode(input, options);
      }, /max length exceeded/i);
    });

    it("throws errors (asynchronous)", async () => {
      await assert.rejects(async () => {
        await decodeAsync(createStream(input), options);
      }, /max length exceeded/i);
    });
  });
});
