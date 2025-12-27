import fs from "node:fs";

const mode = process.argv[2]; // --cjs or --mjs
const files = process.argv.slice(3);

const ext = mode === "--cjs" ? "cjs" : "mjs";
const dtsExt = mode === "--cjs" ? "d.cts" : "d.mts";

console.info(`Fixing ${mode} files with extension ${ext}`);

for (const file of files) {
  if (file.endsWith(".d.ts")) {
    // Handle declaration files: .d.ts => .d.mts or .d.cts
    const newFile = file.replace(/\.d\.ts$/, `.${dtsExt}`);
    console.info(`Processing ${file} => ${newFile}`);
    const content = fs.readFileSync(file).toString("utf-8");
    // Fix import paths: .ts => .mjs or .cjs
    const newContent = content
      .replace(/\bfrom "(\.\.?\/[^"]+)\.ts";/g, `from "$1.${ext}";`)
      .replace(/\bimport "(\.\.?\/[^"]+)\.ts";/g, `import "$1.${ext}";`);
    fs.writeFileSync(newFile, newContent);
    fs.unlinkSync(file);
  } else if (file.endsWith(".js")) {
    // Handle JS files: .js => .mjs or .cjs
    const fileMjs = file.replace(/\.js$/, `.${ext}`);
    console.info(`Processing ${file} => ${fileMjs}`);
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
}
