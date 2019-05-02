import assert from "assert";
import util from "util";
import { Exam } from "msgpack-test-js";
import { MsgTimestamp } from "msg-timestamp";
import { encode as _encode, decode as _decode } from "../src";
import { ExtensionCodec, EXT_TIMESTAMP, encodeTimestampFromTimeSpec } from "../src/ExtensionCodec";
import { BufferType } from "../src/BufferType";

const { encode, decode }: { encode: typeof _encode; decode: typeof _decode } = (() => {
  if (process.env.TEST_DIST) {
    console.log("# TEST_DIST is set");
    return require("../dist.es5/msgpack.js");
  } else {
    return {
      encode: _encode,
      decode: _decode,
    };
  }
})();

const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: EXT_TIMESTAMP,
  encode: (input) => {
    if (input instanceof MsgTimestamp) {
      return encodeTimestampFromTimeSpec({
        sec: input.getTime(),
        nsec: input.getNano(),
      });
    } else {
      return null;
    }
  },
  decode: (_type: number, data: BufferType) => {
    return MsgTimestamp.parse(Buffer.from(data as any));
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
    const first = types[0];
    const title = first + ": " + exam.stringify(first);
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
      STR16: "x".repeat(0x100),
      STR32: "x".repeat(0x10000),
      BIN16: new Uint8Array(0x100).fill(0xff),
      BIN32: new Uint8Array(0x10000).fill(0xff),
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
    } as Record<string, any>;

    for (const name of Object.keys(SPECS)) {
      const value = SPECS[name];

      it(`encodes and decodes ${name}`, () => {
        const encoded = encode(value);
        assert.deepStrictEqual(decode(new Uint8Array(encoded)), value);
      });
    }
  });
});
