import assert from "assert";
import { WASM_AVAILABLE, getWasmError, getWasmExports } from "../src/utils/utf8-wasm.ts";
import { utf8Count, utf8CountJs, utf8Encode, utf8EncodeJs, utf8Decode, utf8DecodeJs } from "../src/utils/utf8.ts";

describe("utf8-wasm", () => {
  describe("initialization", () => {
    it("reports WASM_AVAILABLE status", () => {
      // In Node.js without the flag, wasm should fail to load
      // but we should get a clear error message
      console.log("WASM_AVAILABLE:", WASM_AVAILABLE);
      console.log("WASM error:", getWasmError()?.message);

      // Just verify the exports work
      assert.strictEqual(typeof WASM_AVAILABLE, "boolean");
    });

    it("getWasmExports returns null or valid exports", () => {
      const exports = getWasmExports();
      if (WASM_AVAILABLE) {
        assert.ok(exports !== null);
        assert.ok(typeof exports!.utf8Count === "function");
        assert.ok(typeof exports!.utf8Encode === "function");
        assert.ok(typeof exports!.utf8DecodeToArray === "function");
        assert.ok(typeof exports!.allocArray === "function");
        assert.ok(typeof exports!.arrayToString === "function");
        assert.ok(exports!.memory instanceof WebAssembly.Memory);
      } else {
        assert.strictEqual(exports, null);
      }
    });
  });

  describe("utf8Count", () => {
    const testCases = [
      { input: "", expected: 0, description: "empty string" },
      { input: "hello", expected: 5, description: "ASCII" },
      { input: "こんにちは", expected: 15, description: "Japanese hiragana (3 bytes each)" },
      { input: "🎉", expected: 4, description: "emoji (4 bytes)" },
      { input: "hello🎉world", expected: 14, description: "mixed ASCII and emoji" },
      { input: "Ω", expected: 2, description: "Greek omega (2 bytes)" },
      { input: "€", expected: 3, description: "Euro sign (3 bytes)" },
      { input: "𝄞", expected: 4, description: "Musical G clef (4 bytes, surrogate pair)" },
    ];

    for (const { input, expected, description } of testCases) {
      it(`counts ${description}: "${input}" = ${expected} bytes`, () => {
        const jsResult = utf8CountJs(input);
        const result = utf8Count(input);

        assert.strictEqual(jsResult, expected, `JS implementation failed for "${input}"`);
        assert.strictEqual(result, expected, `utf8Count failed for "${input}"`);
      });
    }
  });

  describe("utf8Encode", () => {
    const testCases = [
      { input: "hello", description: "ASCII" },
      { input: "こんにちは", description: "Japanese" },
      { input: "🎉🎊🎁", description: "emojis" },
      { input: "hello🎉world", description: "mixed" },
      { input: "Ω€𝄞", description: "multi-byte chars" },
      { input: "a".repeat(100), description: "100 ASCII chars" },
      { input: "日".repeat(100), description: "100 Japanese chars" },
    ];

    for (const { input, description } of testCases) {
      it(`encodes ${description}`, () => {
        const byteLength = utf8Count(input);
        const buffer1 = new Uint8Array(byteLength);
        const buffer2 = new Uint8Array(byteLength);

        utf8EncodeJs(input, buffer1, 0);
        utf8Encode(input, buffer2, 0);

        // Compare with TextEncoder as ground truth
        const expected = new TextEncoder().encode(input);
        assert.deepStrictEqual(buffer1, expected, `JS encode failed for "${description}"`);
        assert.deepStrictEqual(buffer2, expected, `utf8Encode failed for "${description}"`);
      });
    }
  });

  describe("utf8Decode", () => {
    const testCases = [
      { input: "hello", description: "ASCII" },
      { input: "こんにちは", description: "Japanese" },
      { input: "🎉🎊🎁", description: "emojis" },
      { input: "hello🎉world", description: "mixed" },
      { input: "Ω€𝄞", description: "multi-byte chars" },
      { input: "a".repeat(100), description: "100 ASCII chars" },
      { input: "日".repeat(100), description: "100 Japanese chars" },
    ];

    for (const { input, description } of testCases) {
      it(`decodes ${description}`, () => {
        const bytes = new TextEncoder().encode(input);

        const jsResult = utf8DecodeJs(bytes, 0, bytes.length);
        const result = utf8Decode(bytes, 0, bytes.length);

        assert.strictEqual(jsResult, input, `JS decode failed for "${description}"`);
        assert.strictEqual(result, input, `utf8Decode failed for "${description}"`);
      });
    }
  });

  describe("round-trip", () => {
    const testStrings = [
      "",
      "hello",
      "Hello, 世界! 🌍",
      "The quick brown fox jumps over the lazy dog",
      "日本語テスト",
      "Emoji: 😀🎉🚀💻🔥",
      "\u0000\u0001\u0002", // control characters
      "Tab:\tNewline:\n",
      "Mixed: ASCII, Ελληνικά, 日本語, العربية, 🎌",
    ];

    for (const str of testStrings) {
      it(`round-trips: "${str.slice(0, 30)}${str.length > 30 ? "..." : ""}"`, () => {
        const byteLength = utf8Count(str);
        const buffer = new Uint8Array(byteLength);
        utf8Encode(str, buffer, 0);
        const decoded = utf8Decode(buffer, 0, byteLength);

        assert.strictEqual(decoded, str);
      });
    }
  });
});
