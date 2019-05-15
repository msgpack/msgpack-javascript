import { encode, decode } from "../src";

const data = "Hello, 🌏\n".repeat(10000);

// warm up
const encoded = encode(data);
decode(encoded);

// run

console.time("encode");
for (let i = 0; i < 1000; i++) {
  encode(data);
}
console.timeEnd("encode");

console.time("decode");
for (let i = 0; i < 1000; i++) {
  decode(encoded);
}
console.timeEnd("decode");
