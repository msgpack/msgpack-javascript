import assert from "assert";
import { WASM_AVAILABLE, getWasmError, getWasmExports, utf8CountWasm, utf8EncodeWasm, utf8DecodeWasm } from "../src/utils/utf8-wasm.ts";
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

  // Edge case tests for invalid/malformed data
  // These tests ensure JS and WASM implementations behave identically
  describe("edge cases: lone surrogates", () => {
    // Lone high surrogate (0xD800-0xDBFF without following low surrogate)
    const loneHighSurrogate = "\uD800"; // U+D800
    const loneHighSurrogateAtEnd = "abc\uD800";
    const loneHighSurrogateFollowedByAscii = "\uD800X";
    const loneHighSurrogateFollowedByHighSurrogate = "\uD800\uD800";

    // Lone low surrogate (0xDC00-0xDFFF without preceding high surrogate)
    const loneLowSurrogate = "\uDC00";
    const loneLowSurrogateAtStart = "\uDC00abc";
    const loneLowSurrogateBetweenAscii = "a\uDC00b";

    // Mixed valid and invalid surrogates
    const validSurrogatePair = "\uD83D\uDE00"; // 😀
    const validThenLoneHigh = "\uD83D\uDE00\uD800";
    const loneLowThenValid = "\uDC00\uD83D\uDE00";

    const surrogateTestCases = [
      { str: loneHighSurrogate, description: "lone high surrogate" },
      { str: loneHighSurrogateAtEnd, description: "lone high surrogate at end" },
      { str: loneHighSurrogateFollowedByAscii, description: "lone high surrogate followed by ASCII" },
      { str: loneHighSurrogateFollowedByHighSurrogate, description: "two lone high surrogates" },
      { str: loneLowSurrogate, description: "lone low surrogate" },
      { str: loneLowSurrogateAtStart, description: "lone low surrogate at start" },
      { str: loneLowSurrogateBetweenAscii, description: "lone low surrogate between ASCII" },
      { str: validSurrogatePair, description: "valid surrogate pair (emoji)" },
      { str: validThenLoneHigh, description: "valid pair then lone high" },
      { str: loneLowThenValid, description: "lone low then valid pair" },
    ];

    describe("utf8Count", () => {
      for (const { str, description } of surrogateTestCases) {
        it(`counts ${description} consistently`, () => {
          const jsResult = utf8CountJs(str);

          // JS implementation is the reference - lone surrogates should be 3 bytes each
          assert.ok(jsResult > 0, `JS count should be positive for "${description}"`);

          if (WASM_AVAILABLE) {
            const wasmResult = utf8CountWasm(str);
            assert.strictEqual(wasmResult, jsResult, `WASM count should match JS for "${description}"`);
          }
        });
      }

      it("lone high surrogate counts as 3 bytes", () => {
        // A lone high surrogate (0xD800-0xDBFF) should be encoded as 3 bytes
        // because it's in the 0x800-0xFFFF range
        assert.strictEqual(utf8CountJs("\uD800"), 3);
        if (WASM_AVAILABLE) {
          assert.strictEqual(utf8CountWasm("\uD800"), 3);
        }
      });

      it("lone low surrogate counts as 3 bytes", () => {
        assert.strictEqual(utf8CountJs("\uDC00"), 3);
        if (WASM_AVAILABLE) {
          assert.strictEqual(utf8CountWasm("\uDC00"), 3);
        }
      });

      it("valid surrogate pair counts as 4 bytes", () => {
        assert.strictEqual(utf8CountJs("\uD83D\uDE00"), 4); // 😀
        if (WASM_AVAILABLE) {
          assert.strictEqual(utf8CountWasm("\uD83D\uDE00"), 4);
        }
      });
    });

    describe("utf8Encode", () => {
      for (const { str, description } of surrogateTestCases) {
        it(`encodes ${description} consistently`, () => {
          const byteLength = utf8CountJs(str);
          const jsBuffer = new Uint8Array(byteLength);
          utf8EncodeJs(str, jsBuffer, 0);

          if (WASM_AVAILABLE) {
            const wasmBuffer = new Uint8Array(byteLength);
            utf8EncodeWasm(str, wasmBuffer, 0);
            assert.deepStrictEqual(wasmBuffer, jsBuffer, `WASM encode should match JS for "${description}"`);
          }
        });
      }
    });

    describe("round-trip with lone surrogates", () => {
      for (const { str, description } of surrogateTestCases) {
        it(`round-trips ${description}`, () => {
          const byteLength = utf8CountJs(str);
          const buffer = new Uint8Array(byteLength);
          utf8EncodeJs(str, buffer, 0);
          const decoded = utf8DecodeJs(buffer, 0, byteLength);

          assert.strictEqual(decoded, str, `JS round-trip failed for "${description}"`);

          if (WASM_AVAILABLE) {
            const wasmBuffer = new Uint8Array(byteLength);
            utf8EncodeWasm(str, wasmBuffer, 0);
            const wasmDecoded = utf8DecodeWasm(wasmBuffer, 0, byteLength);
            assert.strictEqual(wasmDecoded, str, `WASM round-trip failed for "${description}"`);
          }
        });
      }
    });
  });

  describe("edge cases: invalid UTF-8 bytes in decode", () => {
    // Invalid UTF-8 sequences that don't match any valid pattern
    const invalidByteSequences = [
      {
        bytes: new Uint8Array([0x80]), // Continuation byte without leading byte
        description: "lone continuation byte 0x80",
      },
      {
        bytes: new Uint8Array([0xBF]), // Continuation byte without leading byte
        description: "lone continuation byte 0xBF",
      },
      {
        bytes: new Uint8Array([0xFE]), // Invalid byte (never valid in UTF-8)
        description: "invalid byte 0xFE",
      },
      {
        bytes: new Uint8Array([0xFF]), // Invalid byte (never valid in UTF-8)
        description: "invalid byte 0xFF",
      },
      {
        bytes: new Uint8Array([0xF8, 0x80, 0x80, 0x80, 0x80]), // 5-byte sequence (invalid)
        description: "5-byte sequence (invalid)",
      },
      {
        bytes: new Uint8Array([0x41, 0x80, 0x42]), // ASCII, invalid, ASCII
        description: "invalid byte between ASCII",
      },
      {
        bytes: new Uint8Array([0xC0, 0x80]), // Overlong encoding of NUL
        description: "overlong encoding of NUL",
      },
      {
        bytes: new Uint8Array([0xE0, 0x80, 0x80]), // Overlong encoding
        description: "overlong 3-byte encoding",
      },
    ];

    describe("utf8Decode preserves invalid bytes", () => {
      for (const { bytes, description } of invalidByteSequences) {
        it(`preserves ${description}`, () => {
          const jsResult = utf8DecodeJs(bytes, 0, bytes.length);

          // The JS implementation should preserve invalid bytes as code units
          // So the result length should be > 0
          assert.ok(jsResult.length > 0, `JS decode should produce output for "${description}"`);

          if (WASM_AVAILABLE) {
            const wasmResult = utf8DecodeWasm(bytes, 0, bytes.length);
            assert.strictEqual(
              wasmResult,
              jsResult,
              `WASM decode should match JS for "${description}": got "${wasmResult}" vs "${jsResult}"`
            );
          }
        });
      }
    });

    describe("invalid bytes are not dropped", () => {
      it("0x80 byte is preserved, not dropped", () => {
        const bytes = new Uint8Array([0x80]);
        const jsResult = utf8DecodeJs(bytes, 0, 1);
        // Should be a single character with code point 0x80
        assert.strictEqual(jsResult.length, 1);
        assert.strictEqual(jsResult.charCodeAt(0), 0x80);

        if (WASM_AVAILABLE) {
          const wasmResult = utf8DecodeWasm(bytes, 0, 1);
          assert.strictEqual(wasmResult.length, 1, "WASM should not drop the byte");
          assert.strictEqual(wasmResult.charCodeAt(0), 0x80);
        }
      });

      it("0xFF byte is preserved, not dropped", () => {
        const bytes = new Uint8Array([0xFF]);
        const jsResult = utf8DecodeJs(bytes, 0, 1);
        assert.strictEqual(jsResult.length, 1);
        assert.strictEqual(jsResult.charCodeAt(0), 0xFF);

        if (WASM_AVAILABLE) {
          const wasmResult = utf8DecodeWasm(bytes, 0, 1);
          assert.strictEqual(wasmResult.length, 1, "WASM should not drop the byte");
          assert.strictEqual(wasmResult.charCodeAt(0), 0xFF);
        }
      });

      it("invalid bytes between valid UTF-8 are preserved", () => {
        // "A" + invalid + "B"
        const bytes = new Uint8Array([0x41, 0x80, 0x42]);
        const jsResult = utf8DecodeJs(bytes, 0, 3);

        // Should be 3 characters: 'A', char(0x80), 'B'
        assert.strictEqual(jsResult.length, 3);
        assert.strictEqual(jsResult.charCodeAt(0), 0x41); // 'A'
        assert.strictEqual(jsResult.charCodeAt(1), 0x80); // invalid byte preserved
        assert.strictEqual(jsResult.charCodeAt(2), 0x42); // 'B'

        if (WASM_AVAILABLE) {
          const wasmResult = utf8DecodeWasm(bytes, 0, 3);
          assert.strictEqual(wasmResult.length, 3, "WASM should produce 3 chars");
          assert.strictEqual(wasmResult, jsResult, "WASM should match JS");
        }
      });

      it("multiple invalid bytes are all preserved", () => {
        const bytes = new Uint8Array([0x80, 0x81, 0x82, 0xFE, 0xFF]);
        const jsResult = utf8DecodeJs(bytes, 0, 5);

        assert.strictEqual(jsResult.length, 5, "All 5 invalid bytes should produce 5 chars");
        assert.strictEqual(jsResult.charCodeAt(0), 0x80);
        assert.strictEqual(jsResult.charCodeAt(1), 0x81);
        assert.strictEqual(jsResult.charCodeAt(2), 0x82);
        assert.strictEqual(jsResult.charCodeAt(3), 0xFE);
        assert.strictEqual(jsResult.charCodeAt(4), 0xFF);

        if (WASM_AVAILABLE) {
          const wasmResult = utf8DecodeWasm(bytes, 0, 5);
          assert.strictEqual(wasmResult.length, 5, "WASM should produce 5 chars");
          assert.strictEqual(wasmResult, jsResult, "WASM should match JS");
        }
      });
    });
  });
});
