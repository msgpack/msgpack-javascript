#!/usr/bin/env deno test --allow-read

/* eslint-disable */
import { deepStrictEqual } from "node:assert";
import { test } from "node:test";
import * as msgpack from "../dist.cjs/index.cjs";

test("Hello, world!", () => {
  const encoded = msgpack.encode("Hello, world!");
  const decoded = msgpack.decode(encoded);
  deepStrictEqual(decoded, "Hello, world!");
});
