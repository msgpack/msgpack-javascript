# MessagePack for JavaScript

[![npm version](https://badge.fury.io/js/%40msgpack%2Fmsgpack.svg)](https://badge.fury.io/js/%40msgpack%2Fmsgpack) [![Build Status](https://travis-ci.org/msgpack/msgpack-javascript.svg?branch=master)](https://travis-ci.org/msgpack/msgpack-javascript) [![codecov](https://codecov.io/gh/msgpack/msgpack-javascript/branch/master/graph/badge.svg)](https://codecov.io/gh/msgpack/msgpack-javascript) [![bundlephobia](https://badgen.net/bundlephobia/minzip/@msgpack/msgpack)](https://bundlephobia.com/result?p=@msgpack/msgpack)

[![Browser Matrix powered by Sauce Labs](https://saucelabs.com/browser-matrix/gfx2019.svg)](https://saucelabs.com)

This is a JavaScript/ECMA-262 implementation of **MessagePack**, an efficient binary serilization format:

https://msgpack.org/

This library is compatible with the "August 2017" revision of MessagePack specification at the point where timestamp ext was added.

## Synopsis

```typescript
import { deepStrictEqual } from "assert";
import { encode, decode } from "@msgpack/msgpack";

const object = {
  nil: null,
  integer: 1,
  float: Math.PI,
  string: "Hello, world!",
  binary: Uint8Array.from([1, 2, 3]),
  array: [10, 20, 30],
  map: { foo: "bar" },
  timestampExt: new Date(),
};

const encoded: Uint8Array = encode(object);

deepStrictEqual(decode(encoded), object);
```

## Install

This library is publised as [@msgpack/msgpack](https://www.npmjs.com/package/@msgpack/msgpack) in npmjs.com.

```shell
npm install @msgpack/msgpack
```

## API

### `encode(data: unknown, options?): Uint8Array`

It encodes `data` and returns a byte array as `Uint8Array`.

### `decode(buffer: ArrayLike<number> | Uint8Array, options?): unknown`

It decodes `buffer` in a byte buffer and returns decoded data as `uknown`.

### `decodeAsync(stream: AsyncIterable<ArrayLike<number> | Uint8Array>, options?): Promise<unknown>`

It decodes `stream` in an async iterable of byte arrays and returns decoded data as `uknown` wrapped in `Promise`. This function works asyncronously.

### Extension Types

To handle [MessagePack Extension Types](https://github.com/msgpack/msgpack/blob/master/spec.md#extension-types), this library provides `ExtensionCodec` class.

Here is an example to setup custom extension types that handles `Map` and `Set` classes in TypeScript:

```typescript
import { encode, decode, ExtensionCodec } from "@msgpack/msgpack";

const extensionCodec = new ExtensionCodec();

// Set<T>
const SET_EXT_TYPE = 0 // Any in 0-127
extensionCodec.register({
  type: SET_EXT_TYPE,
  encode: (object: unknown): Uint8Array | null => {
    if (object instanceof Set) {
      return encode([...object]);
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const array = decode(data) as Array<unknown>;
    return new Set(array);
  },
});

// Map<T>
const MAP_EXT_TYPE = 1; // Any in 0-127
extensionCodec.register({
  type: 1,
  encode: (object: unknown): Uint8Array => {
    if (object instanceof Map) {
      return encode([...object]);
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const array = decode(data) as Array<[unknown, unknown]>;
    return new Map(array);
  },
});

// and later
import { encode, decode } from "@msgpack/msgpack";

const encoded = = encode([new Set<any>(), new Map<any, any>()], { extensionCodec });
const decoded = decode(encoded, { extensionCodec });
```

Not that extension types for custom objects must be `[0, 127]`, while `[-1, -128]` is reserved for MessagePack itself.

#### Handling BigInt with ExtensionCodec

This library does not handle BigInt by default, but you can handle it with `ExtensionCodec` like this:

```typescript
import { deepStrictEqual } from "assert";
import { encode, decode, ExtensionCodec } from "@msgpack/msgpack";

const BIGINT_EXT_TYPE = 0; // Any in 0-127
const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: BIGINT_EXT_TYPE,
  encode: (input: unknown) => {
    if (typeof input === "bigint") {
      return encode(input.toString());
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    return BigInt(decode(data));
  },
});

const value = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
const encoded: = encode(value, { extensionCodec });
deepStrictEqual(decode(encoded, { extensionCodec }), value);
```

## MessagePack Mapping Table

The following table shows how JavaScript values are mapped to [MessagePack formats](https://github.com/msgpack/msgpack/blob/master/spec.md) and vice versa.

Source Value|MessagePack Format|Value Decoded
----|----|----
null, undefined|nil format family|null (*1)
boolean (true, false)|bool format family|boolean (true, false)
number (53-bit int)|int format family|number (53-bit int)
number (64-bit float)|float format family|number (64-bit float)
string|str format family|string
ArrayBufferView |bin format family|Uint8Array (*2)
Array|array format family|Array
Object|map format family|Object (*3)
Date|timestamp ext format family|Date (*4)

* *1 Both `null` and `undefined` are mapped to `nil` (`0xC0`) type, and are decoded into `null`
* *2 Any `ArrayBufferView`s including NodeJS's `Buffer` are mapped to `bin` family, and are decoded into `Uint8Array`
* *3 In handling `Object`, it is regarded as `Record<string, unknown>` in terms of TypeScript
* *4 MessagePack timestamps may have nanoseconds, which will lost when it is decoded into JavaScript `Date`. This behavior can be overrided by registering `-1` for the extension codec.

## Prerequsites

### ECMA-262

* ES5 language features
* ES2018 standard library, including:
  * Typed arrays (ES2015)
  * Async iterations (ES2018)
  * Features added in ES2015-ES2018

ES2018 standard library used in this library can be polyfilled. For example, [core-js](https://github.com/zloirock/core-js) is used as polyfills to run tests on IE11, which has only ES5 language features.

### NodeJS

If you use this library in NodeJS v10 or later is required, but NodeJS v12 is recommended because it includes the V8 feature of [Improving DataView performance in V8](https://v8.dev/blog/dataview).

## Benchmark

Benchmark on NodeJS/v12.1.0

operation                                                         |   op   |   ms  |  op/s
----------------------------------------------------------------- | ------: | ----: | ------:
buf = Buffer.from(JSON.stringify(obj));                           |  493600 |  5000 |   98720
buf = JSON.stringify(obj);                                        |  959600 |  5000 |  191920
obj = JSON.parse(buf);                                            |  346100 |  5000 |   69220
buf = require("msgpack-lite").encode(obj);                        |  358300 |  5000 |   71660
obj = require("msgpack-lite").decode(buf);                        |  270400 |  5000 |   54080
buf = require("@msgpack/msgpack").encode(obj);                    |  594300 |  5000 |  118860
obj = require("@msgpack/msgpack").decode(buf);                    |  343100 |  5000 |   68620

Note that `Buffer.from()` for `JSON.stringify()` is added to emulate I/O where a JavaScript string must be converted into a byte array encoded in UTF-8, whereas MessagePack's `encode()` returns a byte array.

## Distrubition

The NPM package distributed in npmjs.com includes both ES2015+ and ES5 files:

* `/dist` is compiled into ES2015+
* `/dist.es5` is compiled into ES5 and bundled to singile file

If you use NodeJS and/or webpack, their module resolvers use the suitable one automatically.

## Maintenance

## CI

See [.travis.yml](./.travis.yml) for details.

### Relase Engineering

```console
# run tests on NodeJS, Chrome, and Firefox
make test

# edit the changelog
code CHANGELOG.md

# prepare release engineering
npm version major|minor|patch
git push origin master

# run the publishing task
make publish
```

## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by Sauce Labs.

<a href="https://saucelabs.com"><img src="./assets/SauceLabs.svg" alt="Sauce Labs" width="280"></a>

## License

Copyright 2019 The MessagePack community.

This software uses the ISC license:

https://opensource.org/licenses/ISC

See [LICENSE](./LICENSE) for details.
