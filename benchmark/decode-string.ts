/* eslint-disable no-console */
import { utf8EncodeJs, utf8Count, utf8DecodeJs, utf8DecodeTD, WASM_AVAILABLE } from "../src/utils/utf8.ts";
import { getWasmError, utf8DecodeWasm } from "../src/utils/utf8-wasm.ts";

// @ts-ignore
import Benchmark from "benchmark";

// description
console.log("utf8DecodeJs - pure JS implementation");
console.log("utf8DecodeTD - TextDecoder implementation");
console.log("utf8DecodeWasm - WebAssembly implementation");

// Show wasm status
console.log("=".repeat(60));
console.log("WebAssembly Status:");
console.log(`  WASM_AVAILABLE: ${WASM_AVAILABLE}`);
if (WASM_AVAILABLE) {
  console.log("  js-string-builtins: enabled");
} else {
  const error = getWasmError();
  console.log(`  Error: ${error?.message || "unknown"}`);
  if (error?.message?.includes("js-string") || error?.message?.includes("builtin")) {
    console.log("\n  js-string-builtins is enabled by default in Node.js 24+ (V8 13.6+).");
    console.log("  For older versions, run with:");
    console.log("    node --experimental-wasm-imported-strings node_modules/.bin/ts-node benchmark/decode-string.ts");
  }
}
console.log("=".repeat(60));

for (const baseStr of ["A", "あ", "🌏"]) {
  const dataSet = [10, 100, 500, 1_000].map((n) => {
    return baseStr.repeat(n);
  });

  for (const str of dataSet) {
    const byteLength = utf8Count(str);
    const bytes = new Uint8Array(new ArrayBuffer(byteLength));
    utf8EncodeJs(str, bytes, 0);

    console.log(`\n## string "${baseStr}" (strLength=${str.length}, byteLength=${byteLength})\n`);

    const suite = new Benchmark.Suite();

    suite.add("utf8DecodeJs", () => {
      if (utf8DecodeJs(bytes, 0, byteLength) !== str) {
        throw new Error("wrong result!");
      }
    });

    suite.add("utf8DecodeTD", () => {
      if (utf8DecodeTD(bytes, 0, byteLength) !== str) {
        throw new Error("wrong result!");
      }
    });

    if (WASM_AVAILABLE) {
      suite.add("utf8DecodeWasm", () => {
        if (utf8DecodeWasm(bytes, 0, byteLength) !== str) {
          throw new Error("wrong result!");
        }
      });
    }

    suite.on("cycle", (event: any) => {
      console.log(String(event.target));
    });

    suite.run();
  }
}
