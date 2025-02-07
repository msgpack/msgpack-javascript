
import packageJson from "../package.json" with { type: "json" };

const matched = /-(beta|rc)\d+$/.exec(packageJson.version);
console.log(matched?.[1] ?? "latest");
