#!/usr/bin/env deno test

/* eslint-disable */
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import * as msgpack from "../src/index.mjs";

Deno.test("Hello, world!", () => {
  const encoded = msgpack.encode("Hello, world!");
  const decoded = msgpack.decode(encoded);
  assertEquals(decoded, "Hello, world!");
});
