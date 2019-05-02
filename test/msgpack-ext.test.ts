import assert from "assert";
import { encode, decode } from "../src";
import { ExtensionCodec, ExtDataType } from "../src/ExtensionCodec";

function seq(n: number): ReadonlyArray<number> {
  const a: Array<number> = [];
  for (let i = 0; i < n; i++) {
    a.push((i + 1) % 0xff);
  }
  return a;
}

describe("msgpack-ext", () => {
  const SPECS = {
    FIXEXT1: [0xd4, ExtensionCodec.createExtData(0, seq(1))],
    FIXEXT2: [0xd5, ExtensionCodec.createExtData(0, seq(2))],
    FIXEXT4: [0xd6, ExtensionCodec.createExtData(0, seq(4))],
    FIXEXT8: [0xd7, ExtensionCodec.createExtData(0, seq(8))],
    FIXEXT16: [0xd8, ExtensionCodec.createExtData(0, seq(16))],
    EXT8: [0xc7, ExtensionCodec.createExtData(0, seq(17))],
    EXT16: [0xc8, ExtensionCodec.createExtData(0, seq(0x100))],
    EXT32: [0xc9, ExtensionCodec.createExtData(0, seq(0x10000))],
  } as Record<string, [number, ExtDataType]>;

  for (const name of Object.keys(SPECS)) {
    const [msgpackType, extData] = SPECS[name];

    it(`preserves ExtData by decode(encode(${name}))`, () => {
      const encoded = encode(extData);
      assert.strictEqual(encoded[0], msgpackType);
      assert.deepStrictEqual(decode(encoded), extData);
    });
  }
});
