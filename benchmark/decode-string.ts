/* eslint-disable no-console */
import { utf8Encode, utf8Count, utf8Decode } from "../src/utils/utf8";
import { utf8DecodeWasm } from "../src/wasmFunctions";

// @ts-ignore
import Benchmark from "benchmark";

const textDecoder = new TextDecoder();

const dataSet = [10, 100, 200, 1_000, 10_000, 100_000].map((n) => {
  return "a".repeat(n);
});

for (const str of dataSet) {
  const byteLength = utf8Count(str);
  const bytes = new Uint8Array(new ArrayBuffer(byteLength));
  utf8Encode(str, bytes, 0);

  console.log(`\n## string length=${str.length} byteLength=${byteLength}\n`);

  const suite = new Benchmark.Suite();

  const N = Math.round(100_0000 / str.length);

  // use the result to avoid void-context optimizations
  let count = 0;

  suite.add("utf8Decode", () => {
    if (utf8Decode(bytes, 0, byteLength) !== str) {
      throw new Error("wrong result!");
    }
  });

  suite.add("utf8DecodeWasm", () => {
    if (utf8DecodeWasm(bytes, 0, byteLength) !== str) {
      throw new Error("wrong result!");
    }
  });

  suite.add("TextDecoder", () => {
    if (textDecoder.decode(bytes.subarray(0, byteLength)) !== str) {
      throw new Error("wrong result!");
    }
  });
  suite.on("cycle", (event: any) => {
    console.log(String(event.target));
  });

  suite.run();
}
