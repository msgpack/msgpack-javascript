# MessagePack for JavaScript [![Build Status](https://travis-ci.org/msgpack/msgpack-javascript.svg?branch=master)](https://travis-ci.org/msgpack/msgpack-javascript)

This is the pure-JavaScript implementation of MessagePack:

https://msgpack.org/

## Stability

This is under development until v1.0.0. Any API will change without notice.

## Usage

TBD

## Install

```shell
npm install @msgpack/msgpack
```

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
