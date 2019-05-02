import { encode } from "../src";

const data = require("./benchmark-from-msgpack-lite-data.json");

console.time("encode #1");
for (let i = 0; i < 10000; i++) {
  encode(data);
}
console.timeEnd("encode #1");

console.time("encode #2");
for (let i = 0; i < 10000; i++) {
  encode(data);
}
console.timeEnd("encode #2");
