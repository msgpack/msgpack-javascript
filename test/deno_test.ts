#!/usr/bin/env deno run

/* eslint-disable */
import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import * as msgpack from "../mod.ts";

Deno.test("Hello, world!", () => {
  const encoded = msgpack.encode("Hello, world!");
  const decoded = msgpack.decode(encoded);
  assertEquals(decoded, "Hello, world!");
});
