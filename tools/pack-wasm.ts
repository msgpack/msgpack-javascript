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
  fs.writeFileSync(
    `${file}.js`,
    `// generated from ${basename}
"use strict";

var base64 = require("base64-js");

// synchronous instantiation
var wasmModule = new WebAssembly.Module(
  base64.toByteArray(${JSON.stringify(base64.fromByteArray(blob))})
);
var wasmInstance = new WebAssembly.Instance(wasmModule, {
  env: {
    abort: function (filename, line, column) {
      // FIXME: filename is just a number (pointer?)
      throw new Error(\`abort called at \${filename}:\${line}:\${column}\`);
    },
  },
});

module.exports = wasmInstance.exports;
`,
  );
}
