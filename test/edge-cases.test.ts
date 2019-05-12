import assert from "assert";
import { encode, decode, decodeAsync } from "../src";
import { DataViewIndexOutOfBoundsError } from "../src/Decoder";

describe("edge cases", () => {
  context("try to encode trycyclic refs", () => {
    it("throws errors", () => {
      const cyclicRefs: Array<any> = [];
      cyclicRefs.push(cyclicRefs);
      assert.throws(() => {
        encode(cyclicRefs);
      }, /too deep/i);
    });
  });

  context("try to encode non-encodable objects", () => {
    it("throws errors", () => {
      assert.throws(() => {
        encode(() => {});
      }, /unrecognized object/i);
    });
  });

  context("try to decode a map with non-string keys (asynchronous)", () => {
    it("throws errors", async () => {
      const createStream = async function*() {
        yield [0x81]; // fixmap size=1
        yield encode(null);
        yield encode(null);
      };

      await assert.rejects(async () => {
        await decodeAsync(createStream());
      }, /The type of key must be string/i);
    });
  });

  context("try to decode invlid MessagePack binary", () => {
    it("throws errors", () => {
      const TYPE_NEVER_USED = 0xc1;

      assert.throws(() => {
        decode([TYPE_NEVER_USED]);
      }, /unrecognized type byte/i);
    });
  });

  context("try to decode insufficient data", () => {
    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode([
          0x92, // fixarray size=2
          0xc0, // nil
        ]);
        // [IE11] A raw error thrown by DataView
      }, DataViewIndexOutOfBoundsError);
    });

    it("throws errors (asynchronous)", async () => {
      const createStream = async function*() {
        yield [0x92]; // fixarray size=2
        yield encode(null);
      };

      await assert.rejects(async () => {
        await decodeAsync(createStream());
      }, RangeError);
    });
  });

  context("try to decode data with extra bytes", () => {
    it("throws errors (synchronous)", () => {
      assert.throws(() => {
        decode([
          0x90, // fixarray size=0
          ...encode(null),
        ]);
      }, RangeError);
    });

    it("throws errors (asynchronous)", async () => {
      const createStream = async function*() {
        yield [0x90]; // fixarray size=0
        yield encode(null);
      };

      await assert.rejects(async () => {
        await decodeAsync(createStream());
      }, RangeError);
    });

    it("throws errors (asynchronous)", async () => {
      const createStream = async function*() {
        yield [0x90, ...encode(null)]; // fixarray size=0 + nil
      };

      await assert.rejects(async () => {
        await decodeAsync(createStream());
      }, RangeError);
    });
  });
});
