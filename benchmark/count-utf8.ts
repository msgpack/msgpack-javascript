/* eslint-disable no-console */
import { utf8CountJs, WASM_AVAILABLE } from "../src/utils/utf8.ts";
import { getWasmError, utf8CountWasm, RAB_AVAILABLE } from "../src/utils/utf8-wasm.ts";

// @ts-ignore
import Benchmark from "benchmark";

// description
console.log("utf8CountJs - pure JS implementation");
console.log("utf8CountWasm - WebAssembly implementation");

// Show wasm status
console.log("=".repeat(60));
console.log("WebAssembly Status:");
console.log(`  WASM_AVAILABLE: ${WASM_AVAILABLE}`);
if (WASM_AVAILABLE) {
  console.log("  js-string-builtins: enabled");
  console.log(`  RAB_AVAILABLE: ${RAB_AVAILABLE} (resizable ArrayBuffer integration)`);
} else {
  const error = getWasmError();
  console.log(`  Error: ${error?.message || "unknown"}`);
  if (error?.message?.includes("js-string") || error?.message?.includes("builtin")) {
    console.log("\n  js-string-builtins is enabled by default in Node.js 24+ (V8 13.6+).");
    console.log("  For older versions, run with:");
    console.log("    node --experimental-wasm-imported-strings node_modules/.bin/ts-node benchmark/count-utf8.ts");
  }
}
console.log("=".repeat(60));

for (const baseStr of ["A", "あ", "🌏"]) {
  const dataSet = [10, 30, 50, 100, 200, 500, 1000].map((n) => {
    return baseStr.repeat(n);
  });

  for (const str of dataSet) {
    const byteLength = utf8CountJs(str);

    console.log(`\n## string "${baseStr}" (strLength=${str.length}, byteLength=${byteLength})\n`);

    const suite = new Benchmark.Suite();

    suite.add("utf8CountJs", () => {
      utf8CountJs(str);
    });

    if (WASM_AVAILABLE) {
      suite.add("utf8CountWasm", () => {
        utf8CountWasm(str);
      });
    }

    suite.on("cycle", (event: any) => {
      console.log(String(event.target));
    });

    suite.run();
  }
}
