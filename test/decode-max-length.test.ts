import assert from "assert";
import { encode, decode, decodeAsync } from "../src";
import { DecodeOptions } from "../src/decode";

describe("decode with max${Type}Length specified", () => {
  async function* createStream<T>(input: T) {
    yield input;
  }

  context("maxStrLength", () => {
    const input = encode("foo");
    const options: DecodeOptions = { maxStrLength: 1 };

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
    const options: DecodeOptions = { maxBinLength: 1 };

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
    const options: DecodeOptions = { maxArrayLength: 1 };

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
    const options: DecodeOptions = { maxMapLength: 1 };

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
    const options: DecodeOptions = { maxExtLength: 1 };

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
