import { expect, test } from "bun:test";
import { encode, decode } from "../src/index.ts";

test("Hello, world!", () => {
  const encoded = encode("Hello, world!");
  const decoded = decode(encoded);
  expect(decoded).toBe("Hello, world!");
});
