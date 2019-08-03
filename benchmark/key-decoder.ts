/* eslint-disable no-console */
import { utf8EncodeJs, utf8Count, utf8DecodeJs } from "../src/utils/utf8";

// @ts-ignore
import Benchmark from "benchmark";
import { CachedKeyDecoder } from "../src/CachedKeyDecoder";

type InputType = {
  bytes: Uint8Array;
  byteLength: number;
  str: string;
};

const keys: Array<InputType> = Object.keys(require("./benchmark-from-msgpack-lite-data.json")).map((str) => {
  const byteLength = utf8Count(str);
  const bytes = new Uint8Array(new ArrayBuffer(byteLength));
  utf8EncodeJs(str, bytes, 0);
  return { bytes, byteLength, str };
});

for (const dataSet of [keys]) {
  const keyDecoder = new CachedKeyDecoder();
  // make cache storage full
  for (let i = 0; i < keyDecoder.maxKeyLength; i++) {
    for (let j = 0; j < keyDecoder.maxLengthPerKey; j++) {
      const str = `${j.toString().padStart(i + 1, "0")}`;
      const byteLength = utf8Count(str);
      const bytes = new Uint8Array(new ArrayBuffer(byteLength));
      utf8EncodeJs(str, bytes, 0);
      keyDecoder.decode(bytes, 0, byteLength); // fill
    }
  }

  // console.dir(keyDecoder, { depth: 100 });
  console.log("## When the cache storage is full.");

  const suite = new Benchmark.Suite();

  suite.add("utf8DecodeJs", () => {
    for (const data of dataSet) {
      if (utf8DecodeJs(data.bytes, 0, data.byteLength) !== data.str) {
        throw new Error("wrong result!");
      }
    }
  });

  suite.add("CachedKeyDecoder", () => {
    for (const data of dataSet) {
      if (keyDecoder.decode(data.bytes, 0, data.byteLength) !== data.str) {
        throw new Error("wrong result!");
      }
    }
  });
  suite.on("cycle", (event: any) => {
    console.log(String(event.target));
  });

  suite.run();
}
