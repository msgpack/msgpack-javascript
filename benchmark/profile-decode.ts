import { encode, decode, decodeAsync, ExtensionCodec } from "../src";

const data = require("./benchmark-from-msgpack-lite-data.json");
const encoded = encode(data);

console.log("encoded size:", encoded.byteLength);

console.time("decode #1");
for (let i = 0; i < 10000; i++) {
  decode(encoded);
}
console.timeEnd("decode #1");

(async () => {
  const buffers = async function*() {
    yield encoded;
  };

  console.time("decodeAsync #1");
  for (let i = 0; i < 10000; i++) {
    await decodeAsync(buffers());
  }
  console.timeEnd("decodeAsync #1");
})();
