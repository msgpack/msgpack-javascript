/* eslint-disable */
// original: https://raw.githubusercontent.com/kawanet/msgpack-lite/master/lib/benchmark.js

var msgpack_msgpack = require("../src");

var msgpack_node = try_require("msgpack");
var msgpack_lite = try_require("msgpack-lite");
var msgpack_js = try_require("msgpack-js");
var msgpackr = try_require("msgpackr");
var msgpack5 = try_require("msgpack5");
var notepack = try_require("notepack");

msgpack5 = msgpack5 && msgpack5();

var pkg = require("../package.json");
var data = require("./benchmark-from-msgpack-lite-data.json");
var packed = msgpack_lite.encode(data);
var expected = JSON.stringify(data);

var argv = Array.prototype.slice.call(process.argv, 2);

if (argv[0] === "-v") {
  console.warn(pkg.name + " " + pkg.version);
  process.exit(0);
}

var limit = 5;
if (argv[0] - 0) limit = argv.shift() - 0;
limit *= 1000;

var COL1 = 65;
var COL2 = 7;
var COL3 = 5;
var COL4 = 7;

const v8version = process.versions.v8.split(/\./, 2).join('.');
console.log(`Benchmark on NodeJS/${process.version} (V8/${v8version})\n`)
console.log(rpad("operation", COL1), "|", "  op  ", "|", "  ms ", "|", " op/s ");
console.log(rpad("", COL1, "-"), "|", lpad(":", COL2, "-"), "|", lpad(":", COL3, "-"), "|", lpad(":", COL4, "-"));

var buf, obj;

if (JSON) {
  buf = bench('buf = Buffer.from(JSON.stringify(obj));', JSON_stringify, data);
  obj = bench('obj = JSON.parse(buf.toString("utf-8"));', JSON_parse, buf);
  runTest(obj);
}

if (msgpack_lite) {
  buf = bench('buf = require("msgpack-lite").encode(obj);', msgpack_lite.encode, data);
  obj = bench('obj = require("msgpack-lite").decode(buf);', msgpack_lite.decode, packed);
  runTest(obj);
}

if (msgpack_node) {
  buf = bench('buf = require("msgpack").pack(obj);', msgpack_node.pack, data);
  obj = bench('obj = require("msgpack").unpack(buf);', msgpack_node.unpack, buf);
  runTest(obj);
}

if (msgpack_msgpack) {
  buf = bench('buf = require("@msgpack/msgpack").encode(obj);', msgpack_msgpack.encode, data);
  obj = bench('obj = require("@msgpack/msgpack").decode(buf);', msgpack_msgpack.decode, buf);
  runTest(obj);

  const encoder = new msgpack_msgpack.Encoder();
  const decoder = new msgpack_msgpack.Decoder();
  buf = bench('buf = /* @msgpack/msgpack */ encoder.encode(obj);', (data) => encoder.encode(data), data);
  obj = bench('obj = /* @msgpack/msgpack */ decoder.decode(buf);', (buf) => decoder.decode(buf), buf);
  runTest(obj);

  if (process.env["CACHE_HIT_RATE"]) {
    const {hit, miss} = decoder.keyDecoder;
    console.log(`CACHE_HIT_RATE: cache hit rate in CachedKeyDecoder: hit=${hit}, miss=${miss}, hit rate=${hit / (hit + miss)}`);
  }
}

if (msgpackr) {
  buf = bench('buf = require("msgpackr").pack(obj);', msgpackr.pack, data);
  obj = bench('obj = require("msgpackr").unpack(buf);', msgpackr.unpack, buf);
  runTest(obj);
}

if (msgpack_js) {
  buf = bench('buf = require("msgpack-js").encode(obj);', msgpack_js.encode, data);
  obj = bench('obj = require("msgpack-js").decode(buf);', msgpack_js.decode, buf);
  runTest(obj);
}

if (msgpack5) {
  buf = bench('buf = require("msgpack5")().encode(obj);', msgpack5.encode, data);
  obj = bench('obj = require("msgpack5")().decode(buf);', msgpack5.decode, buf);
  runTest(obj);
}

if (notepack) {
  buf = bench('buf = require("notepack").encode(obj);', notepack.encode, data);
  obj = bench('obj = require("notepack").decode(buf);', notepack.decode, buf);
  runTest(obj);
}

function JSON_stringify(src: any): Buffer {
  return Buffer.from(JSON.stringify(src));
}

function JSON_parse(json: Buffer): any {
  return JSON.parse(json.toString("utf-8"));
}

function bench(name: string, func: (...args: any[]) => any, src: any) {
  if (argv.length) {
    var match = argv.filter(function(grep) {
      return (name.indexOf(grep) > -1);
    });
    if (!match.length) return SKIP;
  }
  // warm up
  func(src);

  var ret, duration = 0;
  var start = Date.now();
  var count = 0;
  while (1) {
    var end = Date.now();
    duration = end - start;
    if (duration >= limit) break;
    while ((++count) % 100) ret = func(src);
  }
  name = rpad(name, COL1);
  var score = Math.floor(count / duration! * 1000);
  console.log(name, "|", lpad(`${count}`, COL2), "|", lpad(`${duration}`, COL3), "|", lpad(`${score}`, COL4));
  return ret;
}

function rpad(str: string, len: number, chr = " ") {
  return str.padEnd(len, chr);
}

function lpad(str: string, len: number, chr = " ") {
  return str.padStart(len, chr);
}

function runTest(actual: any) {
  if (actual === SKIP) return;
  actual = JSON.stringify(actual);
  if (actual === expected) return;
  console.warn("expected: " + expected);
  console.warn("actual:   " + actual);
}

function SKIP() {
}

function try_require(name: string) {
  try {
    return require(name);
  } catch (e) {
    // ignore
  }
}
