This is the revision history of @msgpack/msgpack

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
