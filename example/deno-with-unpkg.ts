#!/usr/bin/env deno run
/* eslint-disable no-console */
import * as msgpack from "https://unpkg.com/@msgpack/msgpack/mod.ts";

console.log(msgpack.decode(msgpack.encode("Hello, world!")));
