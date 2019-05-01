import assert from "assert";
import util from "util";
import { Exam } from "msgpack-test-js";
import { MsgTimestamp } from "msg-timestamp";
import { encode, decode } from "../src";
import { ExtensionCodec, EXT_TIMESTAMP, encodeTimestampExtension, encodeTimestampFromTimeSpec } from "../src/ExtensionCodec";
import { BufferType } from "../src/BufferType";

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
});
