/* eslint-disable no-console */
// based on https://github.com/endel/msgpack-benchmark
"use strict";
require("ts-node/register");
const Benchmark = require("benchmark");

const msgpackEncode = require("..").encode;
const msgpackDecode = require("..").decode;
const ExtensionCodec = require("..").ExtensionCodec;

const float32ArrayExtensionCodec = new ExtensionCodec();
float32ArrayExtensionCodec.register({
  type: 0x01,
  encode: (object) => {
    if (object instanceof Float32Array) {
      return new Uint8Array(object.buffer, object.byteOffset, object.byteLength);
    }
    return null;
  },
  decode: (data) => {
    const copy = new Uint8Array(data.byteLength);
    copy.set(data);
    return new Float32Array(copy.buffer);
  },
});

const float32ArrayZeroCopyExtensionCodec = new ExtensionCodec();
float32ArrayZeroCopyExtensionCodec.register({
  type: 0x01,
  encode: (object) => {
    if (object instanceof Float32Array) {
      return (pos) => {
        const bpe = Float32Array.BYTES_PER_ELEMENT;
        const padding = 1 + ((bpe - ((pos + 1) % bpe)) % bpe);
        const data = new Uint8Array(object.buffer);
        const result = new Uint8Array(padding + data.length);
        result[0] = padding;
        result.set(data, padding);
        return result;
      };
    }
    return null;
  },
  decode: (data) => {
    const padding = data[0];
    const bpe = Float32Array.BYTES_PER_ELEMENT;
    const offset = data.byteOffset + padding;
    const length = data.byteLength - padding;
    return new Float32Array(data.buffer, offset, length / bpe);
  },
});

const implementations = {
  "@msgpack/msgpack": {
    encode: msgpackEncode,
    decode: msgpackDecode,
  },
  "@msgpack/msgpack (Float32Array extension)": {
    encode: (data) => msgpackEncode(data, { extensionCodec: float32ArrayExtensionCodec }),
    decode: (data) => msgpackDecode(data, { extensionCodec: float32ArrayExtensionCodec }),
  },
  "@msgpack/msgpack (Float32Array with zero-copy extension)": {
    encode: (data) => msgpackEncode(data, { extensionCodec: float32ArrayZeroCopyExtensionCodec }),
    decode: (data) => msgpackDecode(data, { extensionCodec: float32ArrayZeroCopyExtensionCodec }),
  },
  "msgpack-lite": {
    encode: require("msgpack-lite").encode,
    decode: require("msgpack-lite").decode,
  },
  "notepack.io": {
    encode: require("notepack.io/browser/encode"),
    decode: require("notepack.io/browser/decode"),
  },
};

const samples = [
  {
    // exactly the same as:
    // https://raw.githubusercontent.com/endel/msgpack-benchmark/master/sample-large.json
    name: "./sample-large.json",
    data: require("./sample-large.json"),
  },
  {
    name: "Large array of numbers",
    data: [
      {
        position: new Array(1e3).fill(1.14),
      },
    ],
  },
  {
    name: "Large Float32Array",
    data: [
      {
        position: new Float32Array(1e3).fill(1.14),
      },
    ],
  },
];

function validate(name, data, encoded) {
  return JSON.stringify(data) === JSON.stringify(implementations[name].decode(encoded));
}

for (const sample of samples) {
  const { name: sampleName, data } = sample;
  const encodeSuite = new Benchmark.Suite();
  const decodeSuite = new Benchmark.Suite();

  console.log("");
  console.log("**" + sampleName + ":** (" + JSON.stringify(data).length + " bytes in JSON)");
  console.log("");

  for (const name of Object.keys(implementations)) {
    implementations[name].toDecode = implementations[name].encode(data);
    if (!validate(name, data, implementations[name].toDecode)) {
      console.log("```");
      console.log("Not supported by " + name);
      console.log("```");
      continue;
    }
    encodeSuite.add("(encode) " + name, () => {
      implementations[name].encode(data);
    });
    decodeSuite.add("(decode) " + name, () => {
      implementations[name].decode(implementations[name].toDecode);
    });
  }
  encodeSuite.on("cycle", (event) => {
    console.log(String(event.target));
  });

  console.log("```");
  encodeSuite.run();
  console.log("```");

  console.log("");

  decodeSuite.on("cycle", (event) => {
    console.log(String(event.target));
  });

  console.log("```");
  decodeSuite.run();
  console.log("```");
}
