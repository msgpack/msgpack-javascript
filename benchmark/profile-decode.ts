import { encode, decode, decodeAsync } from "../src";
// @ts-ignore
import _ from "lodash";
const data = require("./benchmark-from-msgpack-lite-data.json");
const dataX = _.cloneDeep(new Array(100).fill(data));
const encoded = encode(dataX);

console.log("encoded size:", encoded.byteLength);

console.time("decode #1");
for (let i = 0; i < 1000; i++) {
  decode(encoded);
}
console.timeEnd("decode #1");

(async () => {
  const buffers = async function*() {
    yield encoded;
  };

  console.time("decodeAsync #1");
  for (let i = 0; i < 1000; i++) {
    await decodeAsync(buffers());
  }
  console.timeEnd("decodeAsync #1");
})();
