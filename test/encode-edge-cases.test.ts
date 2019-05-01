import assert from "assert";
import { encode, decode } from '../src';

describe("edge cases", () => {
  context("try to encode trycyclic refs", () => {
    it("throws errors", () => {
      const cyclicRefs: Array<any> = [];
      cyclicRefs.push(cyclicRefs);
      assert.throws(() => {
        encode(cyclicRefs);
      }, /too deep/i);
    })
  });

  context("try to encode non-encodable objects", () => {
    it("throws errors", () => {
      assert.throws(() => {
        encode(Symbol('this is a symbol!'));
      }, /unrecognized object/i);
    })
  });

  context("try to decode invlid MessagePack binary", () => {
    it("throws errors", () => {
      const TYPE_NEVER_USED = 0xc1;

      assert.throws(() => {
        decode([TYPE_NEVER_USED]);
      }, /unrecognized type byte/i);
    });
  });
});
