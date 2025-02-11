# This is the revision history of @msgpack/msgpack

## 3.0.1 2025-02-11

https://github.com/msgpack/msgpack-javascript/compare/v3.0.1...v3.0.1

* Implement a tiny polyfill to Symbol.dispose ([#261](https://github.com/msgpack/msgpack-javascript/pull/261) to fix #260)


## 3.0.0 2025-02-07

https://github.com/msgpack/msgpack-javascript/compare/v2.8.0...v3.0.0

* Set the compile target to ES2020, dropping support for the dists with the ES5 target
* Fixed a bug that `encode()` and `decode()` were not re-entrant in reusing instances ([#257](https://github.com/msgpack/msgpack-javascript/pull/257))
* Allowed the data alignment to support zero-copy decoding ([#248](https://github.com/msgpack/msgpack-javascript/pull/248), thanks to @EddiG)
* Added an option `rawStrings: boolean` to decoders ([#235](https://github.com/msgpack/msgpack-javascript/pull/235), thanks to @jasonpaulos)
* Optimized GC load by reusing stack states ([#228](https://github.com/msgpack/msgpack-javascript/pull/228), thanks to @sergeyzenchenko)
* Added an option `useBigInt64` to map JavaScript's BigInt to MessagePack's int64 and uint64 ([#223](https://github.com/msgpack/msgpack-javascript/pull/223))
* Drop IE11 support ([#221](https://github.com/msgpack/msgpack-javascript/pull/221))
  * It also fixes [feature request: option to disable TEXT_ENCODING env check #219](https://github.com/msgpack/msgpack-javascript/issues/219)
* Change the interfaces of `Encoder` and `Decoder`, and describe the interfaces in README.md ([#224](https://github.com/msgpack/msgpack-javascript/pull/224)):
  * `new Encoder(options: EncoderOptions)`: it takes the same named-options as `encode()`
  * `new Decoder(options: DecoderOptions)`: it takes the same named-options as `decode()`

## 3.0.0-beta6 2025-02-07

https://github.com/msgpack/msgpack-javascript/compare/v3.0.0-beta5...v3.0.0-beta6

* Set the compile target to ES2020, dropping support for the dists with the ES5 target

## 3.0.0-beta5 2025-02-06

https://github.com/msgpack/msgpack-javascript/compare/v3.0.0-beta4...v3.0.0-beta5

* Fixed a bug that `encode()` and `decode()` were not re-entrant in reusing instances ([#257](https://github.com/msgpack/msgpack-javascript/pull/257))

## 3.0.0-beta4 2025-02-04

https://github.com/msgpack/msgpack-javascript/compare/v3.0.0-beta3...v3.0.0-beta4

* Added Deno test to CI
* Added Bun tests to CI
* Allowed the data alignment to support zero-copy decoding ([#248](https://github.com/msgpack/msgpack-javascript/pull/248), thanks to @EddiG)

## 3.0.0-beta3 2025-01-26

https://github.com/msgpack/msgpack-javascript/compare/v3.0.0-beta2...v3.0.0-beta3

* Added an option `rawStrings: boolean` to decoders ([#235](https://github.com/msgpack/msgpack-javascript/pull/235), thanks to @jasonpaulos)
* Optimized GC load by reusing stack states ([#228](https://github.com/msgpack/msgpack-javascript/pull/228), thanks to @sergeyzenchenko)
* Drop support for Node.js v16
* Type compatibility with ES2024 / SharedArrayBuffer

## 3.0.0-beta2

https://github.com/msgpack/msgpack-javascript/compare/v3.0.0-beta1...v3.0.0-beta2

* Upgrade TypeScript compiler to v5.0

## 3.0.0-beta1

https://github.com/msgpack/msgpack-javascript/compare/v2.8.0...v3.0.0-beta1

* Added an option `useBigInt64` to map JavaScript's BigInt to MessagePack's int64 and uint64 ([#223](https://github.com/msgpack/msgpack-javascript/pull/223))
* Drop IE11 support ([#221](https://github.com/msgpack/msgpack-javascript/pull/221))
  * It also fixes [feature request: option to disable TEXT_ENCODING env check #219](https://github.com/msgpack/msgpack-javascript/issues/219)
* Change the interfaces of `Encoder` and `Decoder`, and describe the interfaces in README.md ([#224](https://github.com/msgpack/msgpack-javascript/pull/224)):
  * `new Encoder(options: EncoderOptions)`: it takes the same named-options as `encode()`
  * `new Decoder(options: DecoderOptions)`: it takes the same named-options as `decode()`

## 2.8.0 2022-09-02

https://github.com/msgpack/msgpack-javascript/compare/v2.7.2...v2.8.0

* Let `Encoder#encode()` return a copy of the internal buffer, instead of the reference of the buffer (fix #212).
  * Introducing `Encoder#encodeSharedRef()` to return the shared reference to the internal buffer.

## 2.7.2 2022/02/08

https://github.com/msgpack/msgpack-javascript/compare/v2.7.1...v2.7.2

* Fix a build problem in Nuxt3 projects [#200](https://github.com/msgpack/msgpack-javascript/pull/200) reported by (reported as #199 in @masaha03)

## 2.7.1 2021/09/01

https://github.com/msgpack/msgpack-javascript/compare/v2.7.0...v2.7.1

* No code changes
* Build with TypeScript 4.4

## 2.7.0 2021/05/20

https://github.com/msgpack/msgpack-javascript/compare/v2.6.3...v2.7.0

* Made sure timestamp decoder to raise DecodeError in errors
  * This was found by fuzzing tests using [jsfuzz](https://gitlab.com/gitlab-org/security-products/analyzers/fuzzers/jsfuzz)
* Tiny optimizations and refactoring

## 2.6.3 2021/05/04

https://github.com/msgpack/msgpack-javascript/compare/v2.6.2...v2.6.3

* Added `mod.ts` for Deno support

## 2.6.2 2021/05/04

https://github.com/msgpack/msgpack-javascript/compare/v2.6.1...v2.6.2

* Improve Deno support (see example/deno-*.ts for details)

## 2.6.1 2021/05/04

https://github.com/msgpack/msgpack-javascript/compare/v2.6.0...v2.6.1

* Recover Decoder instance states after `DecodeError` (mitigating [#160](https://github.com/msgpack/msgpack-javascript/issues/160))

## 2.6.0 2021/04/21

https://github.com/msgpack/msgpack-javascript/compare/v2.5.1...v2.6.0

* Revert use of `tslib` (added in 2.5.0) to fix [#169](https://github.com/msgpack/msgpack-javascript/issues/169)

## v2.5.1 2021/03/21

https://github.com/msgpack/msgpack-javascript/compare/v2.5.0...v2.5.1

* Fixed the ESM package's dependencies
## v2.5.0 2021/03/21

https://github.com/msgpack/msgpack-javascript/compare/v2.4.1...v2.5.0

* Throws `DecodeError` in decoding errors
* Rejects `__proto__` as a map key, throwing `DecodeError`
  * Thank you to Ninevra Leanne Walden for reporting this issue
* Added `tslib` as a dependency

## v2.4.1 2021/03/01

https://github.com/msgpack/msgpack-javascript/compare/v2.4.0...v2.4.1

* Fixed a performance regression that `TextEncoder` and `TextDecoder` were never used even if available ([reported as #157 by @ChALkeR](https://github.com/msgpack/msgpack-javascript/issues/157))

## v2.4.0 2021/02/15

https://github.com/msgpack/msgpack-javascript/compare/v2.3.1...v2.4.0

* Renamed `decodeStream()` to `decodeMultiStream()`
  * `decodeStream()` is kept as a deprecated function but will be removed in a future
* Added `decodeMulti()`, a synchronous variant for `decodeMultiStream()` (thanks to @Bilge for the request in [#152](https://github.com/msgpack/msgpack-javascript/issues/152))
* Improved `decodeAsync()` and its family to accept `BufferSource` (thanks to @rajaybasu for the suggestion in [#152-issuecomment-778712021)](https://github.com/msgpack/msgpack-javascript/issues/152#issuecomment-778712021))

## v2.3.1 2021/02/13

https://github.com/msgpack/msgpack-javascript/compare/v2.3.0...v2.3.1

* Fixed a lot of typos
* Update dev environment:
  * Migration to GitHub Actions
  * Upgrade Webpack from v4 to v5
  * Enable `noImplicitReturns` and `noUncheckedIndexedAccess` in tsconfig

## v2.3.0 2020/10/17

https://github.com/msgpack/msgpack-javascript/compare/v2.2.1...v2.3.0

* Change the extension of ESM files from `.js` to `.mjs` [#144](https://github.com/msgpack/msgpack-javascript/pull/144)
* Make the package work with `strictNullChecks: false` [#139](https://github.com/msgpack/msgpack-javascript/pull/139) by @bananaumai

## v2.2.1 2020/10/11

https://github.com/msgpack/msgpack-javascript/compare/v2.2.0...v2.2.1

* Fix `package.json` for webpack to use `module` field

## v2.2.0 2020/10/04

https://github.com/msgpack/msgpack-javascript/compare/v2.1.1...v2.2.0

* Now `package.json` has a `module` field to support ES modules

## v2.1.1 2020/10/04

https://github.com/msgpack/msgpack-javascript/compare/v2.1.0...v2.1.1

* Fixed typos
* Refactored the codebase

## v2.1.0 2020/09/21

https://github.com/msgpack/msgpack-javascript/compare/v2.0.0...v2.1.0

* Added `forceIntegerToFloat` option to `EncodeOptions` by @carbotaniuman ([#123](https://github.com/msgpack/msgpack-javascript/pull/123))

## v2.0.0 2020/09/06

https://github.com/msgpack/msgpack-javascript/compare/v1.12.2...v2.0.0

* Officially introduce direct use of `Encoder` and `Decoder` for better performance
  * The major version was bumped because it changed the interface to `Encoder` and `Decoder`
* Build with TypeScript 4.0

## v1.12.2 2020/05/14

https://github.com/msgpack/msgpack-javascript/compare/v1.12.1...v1.12.2

* Build with TypeScript 3.９

## v1.12.1 2020/04/08

https://github.com/msgpack/msgpack-javascript/compare/v1.12.0...v1.12.1

* Build with TypeScript 3.8

## v1.12.0 2020/03/03

https://github.com/msgpack/msgpack-javascript/compare/v1.11.1...v1.12.0

* Add `EncodeOptions#ignoreUndefined` [#107](https://github.com/msgpack/msgpack-javascript/pull/107)
  * Like `JSON.stringify()`, less payload size, but taking more time to encode

## v1.11.1 2020/02/26

https://github.com/msgpack/msgpack-javascript/compare/v1.11.0...v1.11.1

* Fix use of `process.env` for browsers (#104)

## v1.11.0 2020/01/15

https://github.com/msgpack/msgpack-javascript/compare/v1.10.1...v1.11.0

* Added support for custom context for keeping track of objects ([#101](https://github.com/msgpack/msgpack-javascript/pull/101) by @grantila)
* Export ``EncodeOptions` and `DecodeOptions` ([#100](https://github.com/msgpack/msgpack-javascript/pull/100))

## v1.10.1 2020/01/11

https://github.com/msgpack/msgpack-javascript/compare/v1.10.0...v1.10.1

* Re-package it with the latest Webpack and Terser

## v1.10.0 2019/12/27

https://github.com/msgpack/msgpack-javascript/compare/v1.9.3...v1.10.0

* Remove WebAssembly implementation, which introduced complexity rather than performance ([#95](https://github.com/msgpack/msgpack-javascript/pull/95))

## v1.9.3 2019/10/30

https://github.com/msgpack/msgpack-javascript/compare/v1.9.2...v1.9.3

* Fix a possible crash in decoding long strings (amending #88): [#90](https://github.com/msgpack/msgpack-javascript/pull/90) by @chrisnojima


## v1.9.2 2019/10/30

https://github.com/msgpack/msgpack-javascript/compare/v1.9.1...v1.9.2

* Fix a possible crash in decoding long strings: [#88](https://github.com/msgpack/msgpack-javascript/pull/88) by @chrisnojima

## v1.9.1 2019/09/20

https://github.com/msgpack/msgpack-javascript/compare/v1.9.0...v1.9.1

* No code changes from 1.9.0
* Upgrade dev dependencies

## v1.9.0 2019/08/31

https://github.com/msgpack/msgpack-javascript/compare/v1.8.0...v1.9.0

* [Make cachedKeyDecoder configurable by sergeyzenchenko · Pull Request \#85](https://github.com/msgpack/msgpack-javascript/pull/85)
* [Add support for numbers as map keys by sergeyzenchenko · Pull Request \#84](https://github.com/msgpack/msgpack-javascript/pull/84)
* Build with TypeScript 3.6

## v1.8.0 2019/08/07

https://github.com/msgpack/msgpack-javascript/compare/v1.7.0...v1.8.0

* Adjust internal cache size according to benchmark results [bc5e681](https://github.com/msgpack/msgpack-javascript/commit/bc5e681e781881ed27efaf97ba4156b484dc7648)
* Internal refactoring [#82](https://github.com/msgpack/msgpack-javascript7/pull/82)

## v1.7.0 2019/08/2

https://github.com/msgpack/msgpack-javascript/compare/v1.6.0...v1.7.0

* Introduce cache for map keys, which improves decoding in 1.5x faster for the benchmark (@sergeyzenchenko) [#54](https://github.com/msgpack/msgpack-javascript/pull/54)
  *

## v1.6.0 2019/07/19

https://github.com/msgpack/msgpack-javascript/compare/v1.5.0...v1.6.0

* Add `EncodeOptions.forceFloat32` to encode non-integer numbers in float32 (default to float64) [#79](https://github.com/msgpack/msgpack-javascript/pull/79)

## v1.5.0 2019/07/17

https://github.com/msgpack/msgpack-javascript/compare/v1.4.6...v1.5.0

* Improve `decode()` to handle `ArrayBuffer` [#78](https://github.com/msgpack/msgpack-javascript/pull/78)

## v1.4.6 2019/07/09

https://github.com/msgpack/msgpack-javascript/compare/v1.4.5...v1.4.6

* use `TextEncoder` to encode string in UTF-8 for performance [#68](https://github.com/msgpack/msgpack-javascript/pull/68)

## v1.4.5 2019/06/24

https://github.com/msgpack/msgpack-javascript/compare/v1.4.4...v1.4.5

* Fix an encoding result of -128 from int16 to int8 [#73](https://github.com/msgpack/msgpack-javascript/pull/73)

## v1.4.4 2019/06/22

https://github.com/msgpack/msgpack-javascript/compare/v1.4.1...v1.4.4

* Fix the UMD build setting to correctly setup `MessagePack` module in the global object

## v1.4.3, v1.4.2

Mispackaged.

## v1.4.1 2019/06/22

https://github.com/msgpack/msgpack-javascript/compare/v1.4.0...v1.4.1

* Improved entrypoints for browsers:
  * Build as UMD
  * Minidifed by default

## v1.4.0 2019/06/12

https://github.com/msgpack/msgpack-javascript/compare/v1.3.2...v1.4.0

* Added `sortKeys: boolean` option to `encode()` for canonical encoding [#64](https://github.com/msgpack/msgpack-javascript/pull/64)
* Fixed `RangeError` in encoding BLOB [#66](https://github.com/msgpack/msgpack-javascript/pull/66)

## v1.3.2 2019/06/04

https://github.com/msgpack/msgpack-javascript/compare/v1.3.1...v1.3.2

* Fix typings for older TypeScript [#55](https://github.com/msgpack/msgpack-javascript/pull/55)

## v1.3.1 2019/06/01

https://github.com/msgpack/msgpack-javascript/compare/v1.3.0...v1.3.1

* Fix missing exports of `decodeStream()`

## v1.3.0 2019/05/29

https://github.com/msgpack/msgpack-javascript/compare/v1.2.3...v1.3.0

* Add `decodeArrayStream()` to decode an array and returns `AsyncIterable<unknown>` [#42](https://github.com/msgpack/msgpack-javascript/pull/42)
* Add `decodeStream()` to decode an unlimited data stream [#46](https://github.com/msgpack/msgpack-javascript/pull/46)
* Let `decodeAsync()` and `decodeArrayStream()` to take `ReadalbeStream<Uint8Array | ArrayLike<number>>` (whatwg-streams) [#43](https://github.com/msgpack/msgpack-javascript/pull/46)

## v1.2.3 2019/05/29

https://github.com/msgpack/msgpack-javascript/compare/v1.2.2...v1.2.3

* More optimizations for string decoding performance

## v1.2.2 2019/05/29

https://github.com/msgpack/msgpack-javascript/compare/v1.2.1...v1.2.2

* Improved array decoding performance ([#32](https://github.com/msgpack/msgpack-javascript/pull/32) by @sergeyzenchenko)
* Improved string decoding performance with TextDecoder ([#34](https://github.com/msgpack/msgpack-javascript/pull/34) by @sergeyzenchenko)

## v1.2.1 2019/05/26

https://github.com/msgpack/msgpack-javascript/compare/v1.2.0...v1.2.1

* Reduced object allocations in `encode()`

## v1.2.0 2019/05/25

https://github.com/msgpack/msgpack-javascript/compare/v1.1.0...v1.2.0

* Shipped with WebAssembly ([#26](https://github.com/msgpack/msgpack-javascript/pull/26))
* Fix handling strings to keep lone surrogates
* Fix issues in decoding very large string, which caused RangeError

## v1.1.0 2019/05/19

https://github.com/msgpack/msgpack-javascript/compare/v1.0.0...v1.1.0

* Add options to `decode()` and `decodeAsync()`:
  `maxStrLength`, `maxBinLength`, `maxArrayLength`, `maxMapLength`, and `maxExtLength` to limit max length of each item

## v1.0.1 2019/05/12

https://github.com/msgpack/msgpack-javascript/compare/v1.0.0...v1.0.1

* Fix IE11 incompatibility

## v1.0.0 2019/05/11

* Initial stable release
