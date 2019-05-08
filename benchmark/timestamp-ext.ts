import { encode, decode } from "../src";

const data = new Array(100).fill(new Date());

// warm up
const encoded = encode(data);
decode(encoded);

// run

console.time("encode");
for (let i = 0; i < 10000; i++) {
  encode(data);
}
console.timeEnd("encode");

console.time("decode");
for (let i = 0; i < 10000; i++) {
  decode(encoded);
}
console.timeEnd("decode");
