#!/usr/bin/env deno run
/* eslint-disable no-console */
import * as msgpack from "https://esm.sh/@msgpack/msgpack";

console.log(msgpack.decode(msgpack.encode("Hello, world!")));
