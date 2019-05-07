# MessagePack for JavaScript [![npm version](https://badge.fury.io/js/%40msgpack%2Fmsgpack.svg)](https://badge.fury.io/js/%40msgpack%2Fmsgpack) [![Build Status](https://travis-ci.org/msgpack/msgpack-javascript.svg?branch=master)](https://travis-ci.org/msgpack/msgpack-javascript)

This is the pure-JavaScript implementation of **MessagePack**, an efficient binary serilization format:

https://msgpack.org/

## Stability

This is under development until v1.0.0. Any API will change without notice.

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
extensionCodec.register({
  type: 0,
  encode: (object: unknown): Uint8Array | null => {
    if (object instanceof Set) {
      return encode([...object]);
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const array = decode(data) as Array<any>;
    return new Set(array);
  },
});

// Map<T>
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

## Prerequsites

### ECMA-262

* ES5 language features
* Typed Arrays (ES2015; [caniuse: typedarrays](https://caniuse.com/#feat=typedarrays))
* String.prototype.padStart (ES2017; [caniuse: pad-start-end](https://caniuse.com/#feat=pad-start-end))

You can use polyfills for them.

### NodeJS

If you use this library in NodeJS, v10 or later is required, but NodeJS v12 is recommended because it includes the V8 feature of [Improving DataView performance in V8](https://v8.dev/blog/dataview).

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

## License

Copyright 2019 The MessagePack Community.

This software is licensed under the ISC license:

https://opensource.org/licenses/ISC

See [LICENSE](./LICENSE) for details.
