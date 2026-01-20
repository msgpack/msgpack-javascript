import { throws } from "assert";
import { encode, decode, DecodeError } from "../src/index.ts";

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

  context("constructor exists as a map key", () => {
    it("raises DecodeError in decoding", () => {
      const o = {
        foo: "bar",
      };
      // override constructor as an enumerable property
      Object.defineProperty(o, "constructor", {
        value: new Date(0),
        enumerable: true,
      });
      const encoded = encode(o);

      throws(() => {
        decode(encoded);
      }, DecodeError);
    });
  });

  context("prototype exists as a map key", () => {
    it("raises DecodeError in decoding", () => {
      const o = {
        foo: "bar",
      };
      // override prototype as an enumerable property
      Object.defineProperty(o, "prototype", {
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
