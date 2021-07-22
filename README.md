# MessagePack for JavaScript/ECMA-262  <!-- omit in toc -->

[![npm version](https://img.shields.io/npm/v/@msgpack/msgpack.svg)](https://www.npmjs.com/package/@msgpack/msgpack) ![CI](https://github.com/msgpack/msgpack-javascript/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/msgpack/msgpack-javascript/branch/master/graphs/badge.svg)](https://codecov.io/gh/msgpack/msgpack-javascript) [![minzip](https://badgen.net/bundlephobia/minzip/@msgpack/msgpack)](https://bundlephobia.com/result?p=@msgpack/msgpack) [![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@msgpack/msgpack)](https://bundlephobia.com/result?p=@msgpack/msgpack)

<!--
[![Browser Matrix powered by Sauce Labs](https://app.saucelabs.com/browser-matrix/gfx2019.svg)](https://app.saucelabs.com/u/gfx2019) -->

This is a JavaScript/ECMA-262 implementation of **MessagePack**, an efficient binary serilization format:

https://msgpack.org/

This library is a universal JavaScript, meaning it is compatible with all the major browsers and NodeJS. In addition, because it is implemented in [TypeScript](https://www.typescriptlang.org/), type definition files (`d.ts`) are bundled in the distribution.

*Note that this is the second version of MessagePack for JavaScript. The first version, which was implemented in ES5 and was never released to npmjs.com, is tagged as [classic](https://github.com/msgpack/msgpack-javascript/tree/classic).*

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

## Table of Contents

- [Synopsis](#synopsis)
- [Table of Contents](#table-of-contents)
- [Install](#install)
- [API](#api)
  - [`encode(data: unknown, options?: EncodeOptions): Uint8Array`](#encodedata-unknown-options-encodeoptions-uint8array)
    - [`EncodeOptions`](#encodeoptions)
  - [`decode(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions): unknown`](#decodebuffer-arraylikenumber--buffersource-options-decodeoptions-unknown)
    - [`DecodeOptions`](#decodeoptions)
  - [`decodeMulti(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions): Generator<unknown, void, unknown>`](#decodemultibuffer-arraylikenumber--buffersource-options-decodeoptions-generatorunknown-void-unknown)
  - [`decodeAsync(stream: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeAsyncOptions): Promise<unknown>`](#decodeasyncstream-readablestreamlikearraylikenumber--buffersource-options-decodeasyncoptions-promiseunknown)
  - [`decodeArrayStream(stream: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeAsyncOptions): AsyncIterable<unknown>`](#decodearraystreamstream-readablestreamlikearraylikenumber--buffersource-options-decodeasyncoptions-asynciterableunknown)
  - [`decodeMultiStream(stream: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeAsyncOptions): AsyncIterable<unknown>`](#decodemultistreamstream-readablestreamlikearraylikenumber--buffersource-options-decodeasyncoptions-asynciterableunknown)
  - [Reusing Encoder and Decoder instances](#reusing-encoder-and-decoder-instances)
- [Extension Types](#extension-types)
    - [ExtensionCodec context](#extensioncodec-context)
    - [Handling BigInt with ExtensionCodec](#handling-bigint-with-extensioncodec)
    - [The temporal module as timestamp extensions](#the-temporal-module-as-timestamp-extensions)
- [Decoding a Blob](#decoding-a-blob)
- [MessagePack Specification](#messagepack-specification)
  - [MessagePack Mapping Table](#messagepack-mapping-table)
- [Prerequisites](#prerequisites)
  - [ECMA-262](#ecma-262)
  - [NodeJS](#nodejs)
  - [TypeScript](#typescript)
- [Benchmark](#benchmark)
- [Distribution](#distribution)
  - [NPM / npmjs.com](#npm--npmjscom)
  - [CDN / unpkg.com](#cdn--unpkgcom)
- [Deno Support](#deno-support)
- [Maintenance](#maintenance)
  - [Testing](#testing)
  - [Continuous Integration](#continuous-integration)
  - [Release Engineering](#release-engineering)
  - [Updating Dependencies](#updating-dependencies)
- [License](#license)

## Install

This library is published to `npmjs.com` as [@msgpack/msgpack](https://www.npmjs.com/package/@msgpack/msgpack).

```shell
npm install @msgpack/msgpack
```

## API

### `encode(data: unknown, options?: EncodeOptions): Uint8Array`

It encodes `data` into a single MessagePack-encoded object, and returns a byte array as `Uint8Array`, throwing errors if `data` is, or includes, a non-serializable object such as a `function` or a `symbol`.

for example:

```typescript
import { encode } from "@msgpack/msgpack";

const encoded: Uint8Array = encode({ foo: "bar" });
console.log(encoded);
```

If you'd like to convert an `uint8array` to a NodeJS `Buffer`, use `Buffer.from(arrayBuffer, offset, length)` in order not to copy the underlying `ArrayBuffer`, while `Buffer.from(uint8array)` copies it:

```typescript
import { encode } from "@msgpack/msgpack";

const encoded: Uint8Array = encode({ foo: "bar" });

// `buffer` refers the same ArrayBuffer as `encoded`.
const buffer: Buffer = Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
console.log(buffer);
```

#### `EncodeOptions`

Name|Type|Default
----|----|----
extensionCodec | ExtensionCodec | `ExtensionCodec.defaultCodec`
maxDepth | number | `100`
initialBufferSize | number | `2048`
sortKeys | boolean | false
forceFloat32 | boolean | false
forceIntegerToFloat | boolean | false
ignoreUndefined | boolean | false
context | user-defined | -

### `decode(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions): unknown`

It decodes `buffer` that includes a MessagePack-encoded object, and returns the decoded object typed `unknown`.

`buffer` must be an array of bytes, which is typically `Uint8Array` or `ArrayBuffer`. `BufferSource` is defined as `ArrayBuffer | ArrayBufferView`.

In addition, `buffer` can include a single encoded object. If the `buffer` includes extra bytes after an object, it will throw `RangeError`. To decode `buffer` that includes multiple encoded objects, use `decodeMulti()` or `decodeMultiStream()` (recommended) instead.

for example:

```typescript
import { decode } from "@msgpack/msgpack";

const encoded: Uint8Array;
const object = decode(encoded);
console.log(object);
```

NodeJS `Buffer` is also acceptable because it is a subclass of `Uint8Array`.

#### `DecodeOptions`

Name|Type|Default
----|----|----
extensionCodec | ExtensionCodec | `ExtensionCodec.defaultCodec`
maxStrLength | number | `4_294_967_295` (UINT32_MAX)
maxBinLength | number | `4_294_967_295` (UINT32_MAX)
maxArrayLength | number | `4_294_967_295` (UINT32_MAX)
maxMapLength | number | `4_294_967_295` (UINT32_MAX)
maxExtLength | number | `4_294_967_295` (UINT32_MAX)
context | user-defined | -

You can use `max${Type}Length` to limit the length of each type decoded.

### `decodeMulti(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions): Generator<unknown, void, unknown>`

It decodes `buffer` that includes multiple MessagePack-encoded objects, and returns decoded objects as a generator. That is, this is a synchronous variant for `decodeMultiStream()`.

This function is not recommended to decode a MessagePack binary via I/O stream including sockets because it's synchronous. Instead, `decodeMultiStream()` decodes it asynchronously, typically spending less time and memory.

for example:

```typescript
import { decode } from "@msgpack/msgpack";

const encoded: Uint8Array;

for (const object of decodeMulti(encoded)) {
  console.log(object);
}
```

### `decodeAsync(stream: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeAsyncOptions): Promise<unknown>`

It decodes `stream`, where `ReadableStreamLike<T>` is defined as `ReadableStream<T> | AsyncIterable<T>`, in an async iterable of byte arrays, and returns decoded object as `unknown` type, wrapped in `Promise`. This function works asynchronously. This is an async variant for `decode()`.

`DecodeAsyncOptions` is the same as `DecodeOptions` for `decode()`.

This function is designed to work with whatwg `fetch()` like this:

```typescript
import { decodeAsync } from "@msgpack/msgpack";

const MSGPACK_TYPE = "application/x-msgpack";

const response = await fetch(url);
const contentType = response.headers.get("Content-Type");
if (contentType && contentType.startsWith(MSGPACK_TYPE) && response.body != null) {
  const object = await decodeAsync(response.body);
  // do something with object
} else { /* handle errors */ }
```

### `decodeArrayStream(stream: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeAsyncOptions): AsyncIterable<unknown>`

It is alike to `decodeAsync()`, but only accepts a `stream` that includes an array of items, and emits a decoded item one by one.

for example:

```typescript
import { decodeArrayStream } from "@msgpack/msgpack";

const stream: AsyncIterator<Uint8Array>;

// in an async function:
for await (const item of decodeArrayStream(stream)) {
  console.log(item);
}
```

### `decodeMultiStream(stream: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeAsyncOptions): AsyncIterable<unknown>`

It is alike to `decodeAsync()` and `decodeArrayStream()`, but the input `stream` must consist of multiple MessagePack-encoded items. This is an asynchronous variant for `decodeMulti()`.

In other words, it could decode an unlimited stream and emits a decoded item one by one.

for example:

```typescript
import { decodeMultiStream } from "@msgpack/msgpack";

const stream: AsyncIterator<Uint8Array>;

// in an async function:
for await (const item of decodeMultiStream(stream)) {
  console.log(item);
}
```

This function is available since v2.4.0; previously it was called as `decodeStream()`.

### Reusing Encoder and Decoder instances

`Encoder` and `Decoder` classes is provided for better performance:

```typescript
import { deepStrictEqual } from "assert";
import { Encoder, Decoder } from "@msgpack/msgpack";

const encoder = new Encoder();
const decoder = new Decoder();

const encoded: Uint8Array = encoder.encode(object);
deepStrictEqual(decoder.decode(encoded), object);
```

According to our benchmark, reusing `Encoder` instance is about 20% faster
than `encode()` function, and reusing `Decoder` instance is about 2% faster
than `decode()` function. Note that the result should vary in environments
and data structure.

## Extension Types

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
  type: MAP_EXT_TYPE,
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

const encoded = encode([new Set<any>(), new Map<any, any>()], { extensionCodec });
const decoded = decode(encoded, { extensionCodec });
```

Not that extension types for custom objects must be `[0, 127]`, while `[-1, -128]` is reserved for MessagePack itself.

#### ExtensionCodec context

When using an extension codec, it may be necessary to keep encoding/decoding state, to keep track of which objects got encoded/re-created. To do this, pass a `context` to the `EncodeOptions` and `DecodeOptions` (and if using typescript, type the `ExtensionCodec` too). Don't forget to pass the `{extensionCodec, context}` along recursive encoding/decoding:

```typescript
import { encode, decode, ExtensionCodec } from "@msgpack/msgpack";

class MyContext {
  track(object: any) { /*...*/ }
}

class MyType { /* ... */ }

const extensionCodec = new ExtensionCodec<MyContext>();

// MyType
const MYTYPE_EXT_TYPE = 0 // Any in 0-127
extensionCodec.register({
  type: MYTYPE_EXT_TYPE,
  encode: (object, context) => {
    if (object instanceof MyType) {
      context.track(object); // <-- like this
      return encode(object.toJSON(), { extensionCodec, context });
    } else {
      return null;
    }
  },
  decode: (data, extType, context) => {
    const decoded = decode(data, { extensionCodec, context });
    const my = new MyType(decoded);
    context.track(my); // <-- and like this
    return my;
  },
});

// and later
import { encode, decode } from "@msgpack/msgpack";

const context = new MyContext();

const encoded = = encode({myType: new MyType<any>()}, { extensionCodec, context });
const decoded = decode(encoded, { extensionCodec, context });
```

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
            if (input <= Number.MAX_SAFE_INTEGER && input >= Number.MIN_SAFE_INTEGER) {
                return encode(parseInt(input.toString(), 10));
            } else {
                return encode(input.toString());
            }
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

#### The temporal module as timestamp extensions

There is a proposal for a new date/time representations in JavaScript:

* https://github.com/tc39/proposal-temporal

This library maps `Date` to the MessagePack timestamp extension by default, but you can re-map the temporal module (or [Temporal Polyfill](https://github.com/tc39/proposal-temporal/tree/main/polyfill)) to the timestamp extension like this:

```typescript
import { Instant } from "@std-proposal/temporal";
import { deepStrictEqual } from "assert";
import {
  encode,
  decode,
  ExtensionCodec,
  EXT_TIMESTAMP,
  encodeTimeSpecToTimestamp,
  decodeTimestampToTimeSpec,
} from "@msgpack/msgpack";

const extensionCodec = new ExtensionCodec();
extensionCodec.register({
  type: EXT_TIMESTAMP, // override the default behavior!
  encode: (input: any) => {
    if (input instanceof Instant) {
      const sec = input.seconds;
      const nsec = Number(input.nanoseconds - BigInt(sec) * BigInt(1e9));
      return encodeTimeSpecToTimestamp({ sec, nsec });
    } else {
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const timeSpec = decodeTimestampToTimeSpec(data);
    const sec = BigInt(timeSpec.sec);
    const nsec = BigInt(timeSpec.nsec);
    return Instant.fromEpochNanoseconds(sec * BigInt(1e9) + nsec);
  },
});

const instant = Instant.fromEpochMilliseconds(Date.now());
const encoded = encode(instant, { extensionCodec });
const decoded = decode(encoded, { extensionCodec });
deepStrictEqual(decoded, instant);
```

This will be default once the temporal module is standardizied, which is not a near-future, though.

## Decoding a Blob

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) is a binary data container provided by browsers. To read its contents, you can use `Blob#arrayBuffer()` or `Blob#stream()`. `Blob#stream()`
is recommended if your target platform support it. This is because streaming
decode should be faster for large objects. In both ways, you need to use
asynchronous API.

```typescript
async function decodeFromBlob(blob: Blob): unknown {
  if (blob.stream) {
    // Blob#stream(): ReadableStream<Uint8Array> (recommended)
    return await decodeAsync(blob.stream());
  } else {
    // Blob#arrayBuffer(): Promise<ArrayBuffer> (if stream() is not available)
    return decode(await blob.arrayBuffer());
  }
}
```

## MessagePack Specification

This library is compatible with the "August 2017" revision of MessagePack specification at the point where timestamp ext was added:

* [x] str/bin separation, added at August 2013
* [x] extension types, added at August 2013
* [x] timestamp ext type, added at August 2017

The livinng specification is here:

https://github.com/msgpack/msgpack

Note that as of June 2019 there're no official "version" on the MessagePack specification. See https://github.com/msgpack/msgpack/issues/195 for the discussions.

### MessagePack Mapping Table

The following table shows how JavaScript values are mapped to [MessagePack formats](https://github.com/msgpack/msgpack/blob/master/spec.md) and vice versa.

Source Value|MessagePack Format|Value Decoded
----|----|----
null, undefined|nil|null (*1)
boolean (true, false)|bool family|boolean (true, false)
number (53-bit int)|int family|number (53-bit int)
number (64-bit float)|float family|number (64-bit float)
string|str family|string
ArrayBufferView |bin family|Uint8Array (*2)
Array|array family|Array
Object|map family|Object (*3)
Date|timestamp ext family|Date (*4)

* *1 Both `null` and `undefined` are mapped to `nil` (`0xC0`) type, and are decoded into `null`
* *2 Any `ArrayBufferView`s including NodeJS's `Buffer` are mapped to `bin` family, and are decoded into `Uint8Array`
* *3 In handling `Object`, it is regarded as `Record<string, unknown>` in terms of TypeScript
* *4 MessagePack timestamps may have nanoseconds, which will lost when it is decoded into JavaScript `Date`. This behavior can be overridden by registering `-1` for the extension codec.

## Prerequisites

This is a universal JavaScript library that supports major browsers and NodeJS.

### ECMA-262

* ES5 language features
* ES2018 standard library, including:
  * Typed arrays (ES2015)
  * Async iterations (ES2018)
  * Features added in ES2015-ES2018

ES2018 standard library used in this library can be polyfilled with [core-js](https://github.com/zloirock/core-js).

If you support IE11, import `core-js` in your application entrypoints, as this library does in testing for browsers.

### NodeJS

NodeJS v10 is required, but NodeJS v12 or later is recommended because it includes the V8 feature of [Improving DataView performance in V8](https://v8.dev/blog/dataview).

NodeJS before v10 will work by importing `@msgpack/msgpack/dist.es5+umd/msgpack`.

### TypeScript

This module requires definitions of `AsyncIterator` and whatwg streams, which is specified with `"lib": ["ES2020", "DOM"]` in `tsconfig.json`.

For the TypeScript version, the latest TypeScript is tested in development, but older versions of TypeScript might be able to compile this module.

## Benchmark

Run-time performance is not the only reason to use MessagePack, but it's important to choose MessagePack libraries, so a benchmark suite is provided to monitor the performance of this library.

V8's built-in JSON has been improved for years, esp. `JSON.parse()` is [significantly improved in V8/7.6](https://v8.dev/blog/v8-release-76), it is the fastest deserializer as of 2019, as the benchmark result bellow suggests.

However, MessagePack can handles binary data effectively, actual performance depends on situations. You'd better take benchmark on your own use-case if performance matters.

Benchmark on NodeJS/v12.18.3 (V8/7.8)

operation                                                         |   op   |   ms  |  op/s
----------------------------------------------------------------- | ------: | ----: | ------:
buf = Buffer.from(JSON.stringify(obj));                           |  840700 |  5000 |  168140
buf = JSON.stringify(obj);                                        | 1249800 |  5000 |  249960
obj = JSON.parse(buf);                                            | 1648000 |  5000 |  329600
buf = require("msgpack-lite").encode(obj);                        |  603500 |  5000 |  120700
obj = require("msgpack-lite").decode(buf);                        |  315900 |  5000 |   63180
buf = require("@msgpack/msgpack").encode(obj);                    |  945400 |  5000 |  189080
obj = require("@msgpack/msgpack").decode(buf);                    |  770200 |  5000 |  154040
buf = /* @msgpack/msgpack */ encoder.encode(obj);                 | 1162600 |  5000 |  232520
obj = /* @msgpack/msgpack */ decoder.decode(buf);                 |  787800 |  5000 |  157560

Note that `Buffer.from()` for `JSON.stringify()` is necessary to emulate I/O where a JavaScript string must be converted into a byte array encoded in UTF-8, whereas MessagePack's `encode()` returns a byte array.

## Distribution

### NPM / npmjs.com

The NPM package distributed in npmjs.com includes both ES2015+ and ES5 files:

* `dist/` is compiled into ES2019 with CommomJS, provided for NodeJS v10
* `dist.es5+umd/` is compiled into ES5 with UMD
  * `dist.es5+umd/msgpack.min.js` - the minified file
  * `dist.es5+umd/msgpack.js` - the non-minified file
* `dist.es5+esm/` is compiled into ES5 with ES modules, provided for webpack-like bundlers and NodeJS's ESM-mode

If you use NodeJS and/or webpack, their module resolvers use the suitable one automatically.

### CDN / unpkg.com

This library is available via CDN:

```html
<script crossorigin src="https://unpkg.com/@msgpack/msgpack"></script>
```

It loads `MessagePack` module to the global object.


## Deno Support

You can use this module on Deno.

See `example/deno-*.ts` for examples.

`deno.land/x` is not supported yet.

## Maintenance

### Testing

For simple testing:

```
npm run test
```

### Continuous Integration

This library uses Travis CI.

test matrix:

* TypeScript targets
  * `target=es2019` / `target=es5`
* JavaScript engines
  * NodeJS, browsers (Chrome, Firefox, Safari, IE11, and so on)

See [test:* in package.json](./package.json) and [.travis.yml](./.travis.yml) for details.

### Release Engineering

```console
# run tests on NodeJS, Chrome, and Firefox
make test-all

# edit the changelog
code CHANGELOG.md

# bump version
npm version patch|minor|major

# run the publishing task
make publish
```

### Updating Dependencies

```console
npm run update-dependencies
```

<!-- ## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by Sauce Labs.

<a href="https://saucelabs.com"><img src="./assets/SauceLabs.svg" alt="Sauce Labs" width="280"></a> -->

## License

Copyright 2019 The MessagePack community.

This software uses the ISC license:

https://opensource.org/licenses/ISC

See [LICENSE](./LICENSE) for details.
