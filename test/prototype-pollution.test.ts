import { throws } from "node:assert";
import { encode, decode, DecodeError } from "@msgpack/msgpack";

describe("prototype pollution", () => {
  context("__proto__ exists as a map key", () => {
    it("raises DecodeError in decoding", () => {
      const o = {
        foo: "bar",
      };
      // override __proto__ as an enumerable property
      Object.defineProperty(o, "__proto__", {
        value: new Date(0),
        enumerable: true,
      });
      const encoded = encode(o);

      throws(() => {
        decode(encoded);
      }, DecodeError);
    });
  });
});
