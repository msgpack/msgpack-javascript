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
var base64 = require("base64-js");
module.exports.wasmModule = new WebAssembly.Module(
  base64.toByteArray(
    ${JSON.stringify(base64.fromByteArray(blob))}
));
`,
  );
}
