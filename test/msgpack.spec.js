const assert = require("assert");
const { Exam } = require("msgpack-test-js");
const  { msgpack } = require("../msgpack.codec.js");

// set 1 for types to run test
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
    it(title, () => {
      // pack (encode)
      types.forEach((type) => {
        const value = exam.getValue(type);
        const buffer = msgpack.pack(value);
        assert(exam.matchMsgpack(buffer), exam.stringify(type));
      });

      // unpack (decode)
      const msgpacks = exam.getMsgpacks();
      msgpacks.forEach((encoded, idx) => {
        const value = msgpack.unpack(encoded);
        assert(exam.matchValue(value), exam.stringify(idx));
      });
    });
  });
});
