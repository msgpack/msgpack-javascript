/* eslint-disable no-console */
import { utf8EncodeJs, utf8Count, utf8EncodeTE, WASM_AVAILABLE } from "../src/utils/utf8.ts";
import { getWasmError, utf8EncodeWasm } from "../src/utils/utf8-wasm.ts";

// @ts-ignore
import Benchmark from "benchmark";

// description
console.log("utf8EncodeJs - pure JS implementation");
console.log("utf8EncodeTE - TextEncoder implementation");
console.log("utf8EncodeWasm - WebAssembly implementation");

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
    console.log("    node --experimental-wasm-imported-strings node_modules/.bin/ts-node benchmark/encode-string.ts");
  }
}
console.log("=".repeat(60));

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

    suite.add("utf8EncodeTE", () => {
      utf8EncodeTE(str, buffer, 0);
    });

    if (WASM_AVAILABLE) {
      suite.add("utf8EncodeWasm", () => {
        utf8EncodeWasm(str, buffer, 0);
      });
    }

    suite.on("cycle", (event: any) => {
      console.log(String(event.target));
    });

    suite.run();
  }
}
