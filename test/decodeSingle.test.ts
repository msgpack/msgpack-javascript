import assert from "assert";
import { encode, decodeSingle, Decoder } from "../src/index.ts";

describe("decodeSingle", () => {
  it("decodes a single object and returns the number of bytes consumed", () => {
    const item = { name: "foo" };
    const encoded = encode(item);

    const result = decodeSingle(encoded);

    assert.deepStrictEqual(result.value, item);
    assert.strictEqual(result.bytesConsumed, encoded.byteLength);
  });

  it("does not throw an error even if the buffer has extra bytes after the object", () => {
    // simulates a framed buffer: [msgpack object][opaque bytes][msgpack object]
    const firstItem = { type: "binary", size: 4 };
    const secondItem = [1, 2, 3];
    const opaqueBytes = Uint8Array.from([0xc1, 0xff, 0x00, 0xc1]); // 0xc1 is never used in MessagePack

    const encodedFirst = encode(firstItem);
    const encodedSecond = encode(secondItem);
    const buffer = new Uint8Array(encodedFirst.byteLength + opaqueBytes.byteLength + encodedSecond.byteLength);
    buffer.set(encodedFirst);
    buffer.set(opaqueBytes, encodedFirst.byteLength);
    buffer.set(encodedSecond, encodedFirst.byteLength + opaqueBytes.byteLength);

    const first = decodeSingle(buffer);
    assert.deepStrictEqual(first.value, firstItem);
    assert.strictEqual(first.bytesConsumed, encodedFirst.byteLength);

    // skip the opaque bytes, whose size is known from the first object
    const second = decodeSingle(buffer.subarray(first.bytesConsumed + opaqueBytes.byteLength));
    assert.deepStrictEqual(second.value, secondItem);
    assert.strictEqual(second.bytesConsumed, encodedSecond.byteLength);
  });

  it("throws RangeError if the buffer is empty", () => {
    assert.throws(() => {
      decodeSingle(new Uint8Array(0));
    }, RangeError);
  });

  it("throws RangeError if the buffer is truncated", () => {
    const encoded = encode("foobar");
    assert.throws(() => {
      decodeSingle(encoded.subarray(0, encoded.byteLength - 1));
    }, RangeError);
  });

  it("is also available as Decoder#decodeSingle for reusing an instance", () => {
    const items = ["foo", 10];
    const encoded = encode(items[0]);
    const bufferWithExtraBytes = new Uint8Array(encoded.byteLength + encode(items[1]).byteLength);
    bufferWithExtraBytes.set(encoded);
    bufferWithExtraBytes.set(encode(items[1]), encoded.byteLength);

    const decoder = new Decoder();
    for (let i = 0; i < 3; i++) {
      const result = decoder.decodeSingle(bufferWithExtraBytes);
      assert.deepStrictEqual(result.value, items[0]);
      assert.strictEqual(result.bytesConsumed, encoded.byteLength);
    }
  });
});
