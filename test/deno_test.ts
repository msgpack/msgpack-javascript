#!/usr/bin/env deno test

/* eslint-disable */
import { deepStrictEqual } from "node:assert";
import { test } from "node:test";
import * as msgpack from "../mod.ts";

test("Hello, world!", () => {
  const encoded = msgpack.encode("Hello, world!");
  const decoded = msgpack.decode(encoded);
  deepStrictEqual(decoded, "Hello, world!");
});
