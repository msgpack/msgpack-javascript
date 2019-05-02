# MessagePack for JavaScript [![Build Status](https://travis-ci.org/msgpack/msgpack-javascript.svg?branch=master)](https://travis-ci.org/msgpack/msgpack-javascript)

This is the pure-JavaScript implementation of *MessagePack*, an efficient binary serilization format:

https://msgpack.org/

## Stability

This is under development until v1.0.0. Any API will change without notice.

## Synopsis

```typescript
import { deepStrictEqual } from "assert";
import { encode, decode } from "@msgpack/msgpack";

const object = {
  nullOrUndefined: null,
  integer: 1,
  float: Math.PI,
  string: "Hello, world!",
  binary: Uint8Array.from([1, 2, 3]),
  array: [10, 20, 30],
  map: { foo: "bar" },
  timestampExt: new Date(),
};

const encoded = encode(object);
// encoded is an Uint8Array instance

deepStrictEqual(decode(encoded), object);
```

## Install

This library is publised as [@msgpack/msgpack](
https://www.npmjs.com/package/@msgpack/msgpack
) in npmjs.com.

```shell
npm install @msgpack/msgpack
```

## Extension Types

To handle [MessagePack Extension Types](https://github.com/msgpack/msgpack/blob/master/spec.md#extension-types), this library provides `ExtensionCodec` class.

Here is an example to setup custom extension types that handles `Map` and `Set` classes in TypeScript:

```typescript
import { ExtensionCodec } from "@msgpack/msgpack";

const extensionCodec = new ExtensionCodec();

// Set<T>
extensionCodec.register({
  type: 0,
  encode: (object: unknown) => {
    if (object instanceof Set) {
      return encode([...object]);
    } else {
      return null;
    }
  },
  decode: (data) => {
    const array = decode(data) as Array<any>;
    return new Set(array);
  },
});

// Map<T>
extensionCodec.register({
  type: 1,
  encode: (object: unknown) => {
    if (object instanceof Map) {
      return encode([...object]);
    } else {
      return null;
    }
  },
  decode: (data) => {
    const array = decode(data) as Array<[unknown, unknown]>;
    return new Map(array);
  },
});

// and later
import { encode, decode } from "@msgpack/msgpack";

const encoded = = encode([new Set<any>(), new Map<any, any>()], { extensionCodec });
const decoded = decode(encoded, { extensionCodec });
```

Not that extension types for custom objects must be `[0, 127]`, while `[-1, -128]` is reserved to MessagePack itself.

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
