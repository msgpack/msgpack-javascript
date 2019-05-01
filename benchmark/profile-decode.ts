import { encode, decode } from "../src";

const data = require("./benchmark-from-msgpack-lite-data.json");
const encoded = encode(data);

console.time("decode #1");
for (let i = 0; i < 10000; i++) {
  decode(encoded);
}
console.timeEnd("decode #1");

console.time("decode #2");
for (let i = 0; i < 10000; i++) {
  decode(encoded);
}
console.timeEnd("decode #2");
