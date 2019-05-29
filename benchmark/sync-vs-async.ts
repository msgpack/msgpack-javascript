#!ts-node
/* eslint-disable no-console */

import { encode, decode, decodeAsync, decodeArrayStream } from "../src";
import { writeFileSync, unlinkSync, readFileSync, createReadStream } from "fs";
import { deepStrictEqual } from "assert";

(async () => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
    const id = i + 1;
    data.push({
      id,
      score: Math.round(Math.random() * Number.MAX_SAFE_INTEGER),
      title: `Hello, world! #${id}`,
      content: `blah blah blah `.repeat(20).trim(),
      createdAt: new Date(),
    });
  }
  const encoded = encode(data);
  const file = "benchmark/tmp.msgpack";
  writeFileSync(file, encoded);
  process.on("exit", () => unlinkSync(file));
  console.log(`encoded size ${Math.round(encoded.byteLength / 1024)}KiB`);

  deepStrictEqual(decode(readFileSync(file)), data);
  deepStrictEqual(await decodeAsync(createReadStream(file)), data);

  // sync
  console.time("readFileSync |> decode");
  for (let i = 0; i < 100; i++) {
    decode(readFileSync(file));
  }
  console.timeEnd("readFileSync |> decode");

  // async
  console.time("creteReadStream |> decodeAsync");
  for (let i = 0; i < 100; i++) {
    await decodeAsync(createReadStream(file));
  }
  console.timeEnd("creteReadStream |> decodeAsync");

  // asyncArrayStream

  console.time("creteReadStream |> decodeArrayStream");
  for (let i = 0; i < 100; i++) {
    for await (let result of decodeArrayStream(createReadStream(file))) {
      // console.log(result);
    }
  }
  console.timeEnd("creteReadStream |> decodeArrayStream");
})();
