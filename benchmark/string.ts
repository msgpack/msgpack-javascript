/* eslint-disable no-console */
import { encode, decode } from "../src";

const ascii = "A".repeat(40000);
const emoji = "🌏".repeat(20000);

{
  // warm up ascii
  const data = ascii;
  const encoded = encode(data);
  decode(encoded);
  console.log(`encode / decode ascii data.length=${data.length} encoded.byteLength=${encoded.byteLength}`);

  // run

  console.time("encode ascii");
  for (let i = 0; i < 1000; i++) {
    encode(data);
  }
  console.timeEnd("encode ascii");

  console.time("decode ascii");
  for (let i = 0; i < 1000; i++) {
    decode(encoded);
  }
  console.timeEnd("decode ascii");
}

{
  // warm up emoji
  const data = emoji;
  const encoded = encode(data);
  decode(encoded);

  console.log(`encode / decode emoji data.length=${data.length} encoded.byteLength=${encoded.byteLength}`);

  // run

  console.time("encode emoji");
  for (let i = 0; i < 1000; i++) {
    encode(data);
  }
  console.timeEnd("encode emoji");

  console.time("decode emoji");
  for (let i = 0; i < 1000; i++) {
    decode(encoded);
  }
  console.timeEnd("decode emoji");
}
