// pack build/wasm/*.wasm

import fs from "fs";
import { resolve } from "path";
import base64 from "base64-js";

const artifactDir = resolve(__dirname, "../dist/wasm");
for (const basename of fs.readdirSync(artifactDir)) {
  const file = resolve(artifactDir, basename);
  if (!file.endsWith(".wasm")) {
    continue;
  }

  const blob = fs.readFileSync(file);

  const source = `// generated from ${basename}
"use strict";

var base64 = require("base64-js");

// synchronous instantiation
var wasmModule = new WebAssembly.Module(
  base64.toByteArray(${JSON.stringify(base64.fromByteArray(blob))})
);
var wasmInstance = new WebAssembly.Instance(wasmModule, {
  env: {
    abort: abort,
  },
});

// from getStringImpl() in AssemblyScript/lib/loader/index.js
function getString(ptr) {
  var buffer = wasmInstance.exports.memory.buffer;
  var u32 = new Uint32Array(buffer);
  var u16 = new Uint16Array(buffer);
  var offset = (ptr + 4) >>> 1;
  var length = u32[ptr >>> 2];
  return String.fromCharCode(...u16.subarray(offset, offset + length))
}

function abort(message, filename, line, column) {
  throw new Error("abort: " + getString(message) + " at " + getString(filename) + ":" + line + ":" + column);
}

module.exports = wasmInstance.exports;
`;

  fs.writeFileSync(`${file}.js`, source);
}
