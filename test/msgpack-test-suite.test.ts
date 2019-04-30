import assert from "assert";
import util from "util";
import { Exam } from "msgpack-test-js";
import { encode, decode } from "../src";

const TEST_TYPES = {
  array: 1,
  bignum: 0, // TODO
  binary: 1,
  bool: 1,
  map: 1,
  nil: 1,
  number: 1,
  string: 1,
  timestamp: 0, // TODO
};

describe("msgpack-test-suite", () => {
  Exam.getExams(TEST_TYPES).forEach((exam) => {
    const types = exam.getTypes(TEST_TYPES);
    const first = types[0];
    const title = first + ": " + exam.stringify(first);
    it(`encodes ${title}`, () => {
      types.forEach((type) => {
        const value = exam.getValue(type);
        const buffer = Buffer.from(encode(value));

        if (exam.matchMsgpack(buffer)) {
          assert(true, exam.stringify(type));
        } else {
          const msg = `encode(${util.inspect(value)}): expect ${util.inspect(buffer)} to be one of ${util.inspect(exam.getMsgpacks())}`;
          assert(false, msg);
        }
      });
    });

    it(`decodes ${title}`, () => {
      const msgpacks = exam.getMsgpacks();
      msgpacks.forEach((encoded, idx) => {
        const value = decode(encoded);
        if (exam.matchValue(value)) {
          assert(true, exam.stringify(idx));
        } else {
          const values =  exam.getTypes().map((type) => exam.getValue(type));
          const msg = `decode(${util.inspect(encoded)}): expect ${util.inspect(value)} to be one of ${util.inspect(values)}`;
          assert(false, msg);
        }
      });
    });
  });
});
