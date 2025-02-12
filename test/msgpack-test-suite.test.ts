import assert from "assert";
import util from "util";
import { Exam } from "msgpack-test-js";
import { MsgTimestamp } from "msg-timestamp";
import { encode, decode, ExtensionCodec, EXT_TIMESTAMP, encodeTimeSpecToTimestamp } from "../src/index.ts";

const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: EXT_TIMESTAMP,
  encode: (input) => {
    if (input instanceof MsgTimestamp) {
      return encodeTimeSpecToTimestamp({
        sec: input.getTime(),
        nsec: input.getNano(),
      });
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    return MsgTimestamp.parse(Buffer.from(data));
  },
});

const TEST_TYPES = {
  array: 1,
  bignum: 0, // TODO
  binary: 1,
  bool: 1,
  map: 1,
  nil: 1,
  number: 1,
  string: 1,
  timestamp: 1,
};

describe("msgpack-test-suite", () => {
  Exam.getExams(TEST_TYPES).forEach((exam) => {
    const types = exam.getTypes(TEST_TYPES);
    const first = types[0]!;
    const title = `${first}: ${exam.stringify(first)}`;
    it(`encodes ${title}`, () => {
      types.forEach((type) => {
        const value = exam.getValue(type);
        const buffer = Buffer.from(encode(value, { extensionCodec }));

        if (exam.matchMsgpack(buffer)) {
          assert(true, exam.stringify(type));
        } else {
          const msg = `encode(${util.inspect(value)}): expect ${util.inspect(buffer)} to be one of ${util.inspect(
            exam.getMsgpacks(),
          )}`;
          assert(false, msg);
        }
      });
    });

    it(`decodes ${title}`, () => {
      const msgpacks = exam.getMsgpacks();
      msgpacks.forEach((encoded, idx) => {
        const value = decode(encoded, { extensionCodec });
        if (exam.matchValue(value)) {
          assert(true, exam.stringify(idx));
        } else {
          const values = exam.getTypes().map((type) => exam.getValue(type));
          const msg = `decode(${util.inspect(encoded)}): expect ${util.inspect(value)} to be one of ${util.inspect(
            values,
          )}`;
          assert(false, msg);
        }
      });
    });
  });

  context("specs not covered by msgpack-test-js", () => {
    // by detecting test coverage
    const SPECS = {
      FLOAT64_POSITIVE_INF: Number.POSITIVE_INFINITY,
      FLOAT64_NEGATIVE_INF: Number.NEGATIVE_INFINITY,
      FLOAT64_NAN: Number.NaN,
      STR16: "a".repeat(0x100),
      STR16_MBS: "🌏".repeat(0x100),
      STR32: "b".repeat(0x10_000),
      STR32_MBS: "🍣".repeat(0x10_000),
      STR32LARGE: "c".repeat(0x50_000), // may cause "RangeError: Maximum call stack size exceeded" in simple implelementions
      STR_INCLUDING_NUL: "foo\0bar\0",
      STR_BROKEN_FF: "\xff",
      BIN16: new Uint8Array(0x100).fill(0xff),
      BIN32: new Uint8Array(0x10_000).fill(0xff),
      BIN32LARGE: new Uint8Array(0x50_000).fill(0xff), // regression: caused "RangeError: Maximum call stack size exceeded"
      ARRAY16: new Array<boolean>(0x100).fill(true),
      ARRAY32: new Array<boolean>(0x10000).fill(true),
      MAP16: new Array<null>(0x100).fill(null).reduce<Record<string, number>>((acc, _val, i) => {
        acc[`k${i}`] = i;
        return acc;
      }, {}),
      MAP32: new Array<null>(0x10000).fill(null).reduce<Record<string, number>>((acc, _val, i) => {
        acc[`k${i}`] = i;
        return acc;
      }, {}),
      MIXED: new Array(0x10).fill(Number.MAX_SAFE_INTEGER),
    } as Record<string, any>;

    for (const name of Object.keys(SPECS)) {
      const value = SPECS[name];

      it(`encodes and decodes ${name}`, () => {
        const encoded = encode(value);
        assert.deepStrictEqual(decode(new Uint8Array(encoded)), value);
      });
    }
  });

  describe("encoding in minimum values", () => {
    it("int 8", () => {
      assert.deepStrictEqual(encode(-128), Uint8Array.from([0xd0, 0x80]));
    });
  });
});
