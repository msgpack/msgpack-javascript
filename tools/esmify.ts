#!ts-node
/* eslint-disable no-console */

import fs from "fs";

const files = process.argv.slice(2);

for (const file of files) {
  console.info(`Processing ${file}`);
  const content = fs.readFileSync(file).toString("utf8");
  const newContent = content.replace(/\bfrom "([^"]+)";/g, 'from "$1.js";');
  fs.writeFileSync(file, newContent);
}
