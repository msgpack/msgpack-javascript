import assert from "assert";
import { encode, decodeAsync } from "../src";

describe("decodeAsync", () => {
  function wrapWithNoisyBuffer(byte: number) {
    return Uint8Array.from([0x01, byte, 0x02]).subarray(1, 2);
  }

  it("decodes nil", async () => {
    const createStream = async function* () {
      yield wrapWithNoisyBuffer(0xc0); // nil
    };

    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, null);
  });

  it("decodes fixarray [nil]", async () => {
    const createStream = async function* () {
      yield wrapWithNoisyBuffer(0x91); // fixarray size=1
      yield [0xc0]; // nil
    };

    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, [null]);
  });

  it("decodes fixmap {'foo': 'bar'}", async () => {
    const createStream = async function* () {
      yield [0x81]; // fixmap size=1
      yield encode("foo");
      yield encode("bar");
    };

    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, { "foo": "bar" });
  });

  it("decodes multi-byte integer byte-by-byte", async () => {
    const createStream = async function* () {
      yield [0xcd]; // uint 16
      yield [0x12];
      yield [0x34];
    };
    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, 0x1234);
  });

  it("decodes fixstr byte-by-byte", async () => {
    const createStream = async function* () {
      yield [0xa3]; // fixstr size=3
      yield [0x66]; // "f"
      yield [0x6f]; // "o"
      yield [0x6f]; // "o"
    };
    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, "foo");
  });

  it("decodes binary byte-by-byte", async () => {
    const createStream = async function* () {
      yield [0xc4]; // bin 8
      yield [0x03]; // bin size=3
      yield [0x66]; // "f"
      yield [0x6f]; // "o"
      yield [0x6f]; // "o"
    };
    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, Uint8Array.from([0x66, 0x6f, 0x6f]));
  });

  it("decodes binary with noisy buffer", async () => {
    const createStream = async function* () {
      yield wrapWithNoisyBuffer(0xc5); // bin 16
      yield [0x00];
      yield [0x00]; // bin size=0
    };
    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, new Uint8Array(0));
  });

  it("decodes mixed object byte-by-byte", async () => {
    const object = {
      nil: null,
      true: true,
      false: false,
      int: -42,
      uint64: Number.MAX_SAFE_INTEGER,
      int64: Number.MIN_SAFE_INTEGER,
      float: Math.PI,
      string: "Hello, world!",
      longString: "Hello, world!\n".repeat(100),
      binary: Uint8Array.from([0xf1, 0xf2, 0xf3]),
      array: [1000, 2000, 3000],
      map: { foo: 1, bar: 2, baz: 3 },
      timestampExt: new Date(),
      map0: {},
      array0: [],
      str0: "",
      bin0: Uint8Array.from([]),
    };

    const createStream = async function* () {
      for (const byte of encode(object)) {
        yield [byte];
      }
    };
    assert.deepStrictEqual(await decodeAsync(createStream()), object);
  });

  it("decodes BufferSource", async () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/BufferSource
    const createStream = async function* () {
      yield [0x81] as ArrayLike<number>; // fixmap size=1
      yield encode("foo") as BufferSource;
      yield encode("bar") as BufferSource;
    };

    // createStream() returns AsyncGenerator<ArrayLike<number> | BufferSource, ...>
    const object = await decodeAsync(createStream());
    assert.deepStrictEqual(object, { "foo": "bar" });
  });

  it("decodes objects with toJSON methods", async () => {
    const object = {
      string: "Hello, world!",
      nested: {
        int: -45,
        json: {
          toJSON() {
            return {
              float: Math.PI,
              int64: Number.MIN_SAFE_INTEGER,
              timestamp: new Date( 0 ),
              custom: {
                toJSON: () => "custom"
              }
            }
          }
        }
      }
    };

    const createStream = async function* () {
      for (const byte of encode(object)) {
        yield [byte];
      }
    };
    assert.deepStrictEqual(await decodeAsync(createStream()), {
      string: "Hello, world!",
      nested: {
        int: -45,
        json: {
          float: Math.PI,
          int64: Number.MIN_SAFE_INTEGER,
          timestamp: new Date( 0 ),
          custom: "custom"
        }
      }
    });
  });
});
