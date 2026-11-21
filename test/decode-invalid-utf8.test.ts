import assert from "assert";
import { decode } from "../src/index.ts";
import { utf8DecodeJs, utf8DecodeTD } from "../src/utils/utf8.ts";

function str8(bytes: Array<number>): Array<number> {
  return [0xd9, bytes.length, ...bytes];
}

describe("decode invalid UTF-8 strings", () => {
  it("does not read a truncated sequence past the end of the string", () => {
    // ["\xe2\x82", "A"]: the first string must not take the header of the second one
    const actual = decode(Uint8Array.from([0x92, ...str8([0xe2, 0x82]), ...str8([0x41])]));
    assert.deepStrictEqual(actual, ["\ufffd", "A"]);
  });

  it("does not read a truncated sequence past the end of a map key", () => {
    const actual = decode(Uint8Array.from([0x81, 0xa2, 0xe2, 0x82, 0xa1, 0x41]));
    assert.deepStrictEqual(actual, Object.fromEntries([["\ufffd", "A"]]));
  });

  it("decodes overlong sequences to U+FFFD, not to NUL", () => {
    assert.deepStrictEqual(decode(Uint8Array.from(str8([0xc0, 0x80]))), "\ufffd\ufffd");
    assert.deepStrictEqual(decode(Uint8Array.from(str8([0xe0, 0x80, 0x80]))), "\ufffd\ufffd\ufffd");
    assert.deepStrictEqual(decode(Uint8Array.from(str8([0xf0, 0x80, 0x80, 0x80]))), "\ufffd\ufffd\ufffd\ufffd");
  });

  it("decodes short strings the same as long strings", () => {
    const samples = [
      [0x80],
      [0xff],
      [0xc2],
      [0xc1, 0xbf],
      [0xe2, 0x82],
      [0xe0, 0x9f, 0xbf],
      [0xed, 0xa0, 0x80],
      [0xf0, 0x9f, 0x98],
      [0xf4, 0x90, 0x80, 0x80],
      [0xe2, 0x82, 0xac, 0xf0, 0x9f, 0x98, 0x80],
    ];
    for (const sample of samples) {
      const bytes = Uint8Array.from(sample);
      assert.strictEqual(utf8DecodeJs(bytes, 0, bytes.length), utf8DecodeTD(bytes, 0, bytes.length), String(sample));
    }
  });

  it("matches TextDecoder on random byte sequences", () => {
    const pieces = [
      [0x41],
      [0x7f],
      [0xc2, 0xa9],
      [0xe2, 0x82, 0xac],
      [0xf0, 0x9f, 0x98, 0x80],
      [0xf4, 0x8f, 0xbf, 0xbf],
      [0xef, 0xbb, 0xbf],
      [0xc0, 0x80],
      [0xe0, 0x80, 0x80],
      [0xed, 0xa0, 0x80],
      [0xf4, 0x90, 0x80, 0x80],
      [0xf5],
      [0x80],
      [0xc2],
      [0xe2, 0x82],
      [0xf0, 0x9f, 0x98],
    ];
    const decoder = new TextDecoder("utf-8", { ignoreBOM: true });
    let seed = 1;
    const random = (n: number) => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed % n;
    };
    for (let i = 0; i < 5000; i++) {
      const sample: Array<number> = [];
      const count = 1 + random(6);
      for (let j = 0; j < count; j++) {
        sample.push(...pieces[random(pieces.length)]!);
      }
      const bytes = Uint8Array.from([0x20, ...sample, 0x20]);
      assert.strictEqual(utf8DecodeJs(bytes, 1, sample.length), decoder.decode(bytes.subarray(1, 1 + sample.length)));
    }
  });
});
