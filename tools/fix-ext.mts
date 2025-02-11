import fs from "node:fs";

const mode = process.argv[2]; // --cjs or --mjs
const files = process.argv.slice(3);

const ext = mode === "--cjs" ? "cjs" : "mjs";

console.info(`Fixing ${mode} files with extension ${ext}`);

for (const file of files) {
  const fileMjs = file.replace(/\.js$/, `.${ext}`);
  console.info(`Processing ${file} => ${fileMjs}`);
  // .js => .mjs
  const content = fs.readFileSync(file).toString("utf-8");
  const newContent = content
    .replace(/\bfrom "(\.\.?\/[^"]+)\.js";/g, `from "$1.${ext}";`)
    .replace(/\bimport "(\.\.?\/[^"]+)\.js";/g, `import "$1.${ext}";`)
    .replace(/\brequire\("(\.\.?\/[^"]+)\.js"\)/g, `require("$1.${ext}");`)
    .replace(/\/\/# sourceMappingURL=(.+)\.js\.map$/, `//# sourceMappingURL=$1.${ext}.map`);
  fs.writeFileSync(fileMjs, newContent);
  fs.unlinkSync(file);

  // .js.map => .mjs.map
  const mapping = JSON.parse(fs.readFileSync(`${file}.map`).toString("utf-8"));
  mapping.file = mapping.file.replace(/\.js$/, ext);
  fs.writeFileSync(`${fileMjs}.map`, JSON.stringify(mapping));
  fs.unlinkSync(`${file}.map`);
}
