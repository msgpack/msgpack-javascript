import assert from "assert";
import { encode, decode, decodeAsync } from "../src";

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
        encode(Symbol("this is a symbol!"));
      }, /unrecognized object/i);
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
      }, RangeError);
    });

    it("throws errors (asynchronous)", () => {
      const createStream = async function*() {
        yield [0x92]; // fixarray size=2
        yield encode(null);
      };

      assert.rejects(async () => {
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

    it("throws errors (asynchronous)", () => {
      const createStream = async function*() {
        yield [0x90]; // fixarray size=0
        yield encode(null);
      };

      assert.rejects(async () => {
        await decodeAsync(createStream());
      }, RangeError);
    });
  });
});
