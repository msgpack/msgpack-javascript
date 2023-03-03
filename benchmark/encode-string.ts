/* eslint-disable no-console */
import { utf8EncodeJs, utf8Count, utf8EncodeTE } from "../src/utils/utf8";

// @ts-ignore
import Benchmark from "benchmark";

for (const baseStr of ["A", "あ", "🌏"]) {
  const dataSet = [10, 30, 50, 100].map((n) => {
    return baseStr.repeat(n);
  });

  for (const str of dataSet) {
    const byteLength = utf8Count(str);
    const buffer = new Uint8Array(byteLength);

    console.log(`\n## string "${baseStr}" (strLength=${str.length}, byteLength=${byteLength})\n`);

    const suite = new Benchmark.Suite();

    suite.add("utf8EncodeJs", () => {
      utf8EncodeJs(str, buffer, 0);
    });

    suite.add("utf8DecodeTE", () => {
      utf8EncodeTE(str, buffer, 0);
    });
    suite.on("cycle", (event: any) => {
      console.log(String(event.target));
    });

    suite.run();
  }
}
