#!/usr/bin/env deno run
/* eslint-disable no-console */
import * as msgpack from "https://deno.land/x/msgpack_javascript/mod.ts";

console.log(msgpack.decode(msgpack.encode("Hello, world!")));
