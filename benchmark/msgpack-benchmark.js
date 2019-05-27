/* eslint-disable no-console */
// based on https://github.com/endel/msgpack-benchmark
"use strict";

const Benchmark = require("benchmark");
const fs = require("fs");
const msgpack = require("..");

const implementations = {
  "@msgpack/msgpack": {
    encode: require("..").encode,
    decode: require("..").decode,
  },
  "msgpack-lite": {
    encode: require("msgpack-lite").encode,
    decode: require("msgpack-lite").decode,
  },
  "notepack.io": {
    encode: require("notepack.io").encode,
    decode: require("notepack.io").decode,
  },
};

// exactly the same as:
// https://raw.githubusercontent.com/endel/msgpack-benchmark/master/sample-large.json
const sampleFiles = ["./sample-large.json"];

function validate(name, data, encoded) {
  if (JSON.stringify(data) !== JSON.stringify(implementations[name].decode(encoded))) {
    throw new Error("Bad implementation: " + name);
  }
}

for (const sampleFile of sampleFiles) {
  const data = require(sampleFile);
  const encodeSuite = new Benchmark.Suite();
  const decodeSuite = new Benchmark.Suite();

  console.log("");
  console.log("**" + sampleFile + ":** (" + JSON.stringify(data).length + " bytes in JSON)");
  console.log("");

  for (const name of Object.keys(implementations)) {
    implementations[name].toDecode = implementations[name].encode(data);
    validate(name, data, implementations[name].toDecode);
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

  decodeSuite.on("cycle", function(event) {
    console.log(String(event.target));
  });

  console.log("```");
  decodeSuite.run();
  console.log("```");
}
