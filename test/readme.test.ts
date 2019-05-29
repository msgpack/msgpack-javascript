import { deepStrictEqual } from "assert";
import {
  encode,
  decode,
  ExtensionCodec,
  EXT_TIMESTAMP,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
} from "../src";

describe("README", () => {
  context("#synopsis", () => {
    it("runs", () => {
      const object = {
        nil: null,
        integer: 1,
        float: Math.PI,
        string: "Hello, world!",
        binary: Uint8Array.from([1, 2, 3]),
        array: [10, 20, 30],
        map: { foo: "bar" },
        timestampExt: new Date(),
      };

      const encoded = encode(object);
      // encoded is an Uint8Array instance

      deepStrictEqual(decode(encoded), object);
    });
  });

  context("timestamp/temporal", () => {
    before(function() {
      if (typeof BigInt === "undefined") {
        this.skip();
      }
    });

    it("overrides timestamp-ext with std-temporal", () => {
      const Instant = require("@std-proposal/temporal").Instant;

      const extensionCodec = new ExtensionCodec();
      extensionCodec.register({
        type: EXT_TIMESTAMP,
        encode: (input: any) => {
          if (input instanceof Instant) {
            const sec = input.seconds;
            const nsec = Number(input.nanoseconds - BigInt(sec) * BigInt(1e9));
            return encodeTimeSpecToTimestamp({ sec, nsec });
          } else {
            return null;
          }
        },
        decode: (data: Uint8Array) => {
          const timeSpec = decodeTimestampToTimeSpec(data);
          const sec = BigInt(timeSpec.sec);
          const nsec = BigInt(timeSpec.nsec);
          return Instant.fromEpochNanoseconds(sec * BigInt(1e9) + nsec);
        },
      });

      const instant = Instant.fromEpochMilliseconds(Date.now());
      const encoded = encode(instant, { extensionCodec });
      const decoded = decode(encoded, { extensionCodec });
      deepStrictEqual(decoded, instant);
    });
  });
});
