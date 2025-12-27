# WebAssembly String Processing Plan

## Background

### Previous Attempt (2019-2020)

- **PR #26**: Introduced AssemblyScript-based UTF-8 encode/decode
- **PR #95**: Removed it because "Wasm for UTF-8 encode/decode is not much faster than pureJS"

The main issues were:
1. JS-to-Wasm call overhead negated encoding gains
2. String copying between JS and Wasm memory was expensive
3. Maintenance burden wasn't justified by performance gains

### What Changed in 2025

**js-string-builtins** (WebAssembly 3.0, September 2025) fundamentally changes the equation:

- Direct import of JS string operations (`length`, `charCodeAt`, `substring`, etc.) from `wasm:js-string`
- No glue code overhead - operations can be inlined by the engine
- No memory copying at boundaries when consuming JS strings
- Strings stay in JS representation (UTF-16) - no UTF-8/UTF-16 conversion

Browser/runtime support:
- Chrome 131+ (enabled by default)
- Firefox 134+
- Safari: TBD (expressed openness)
- Node.js 24+ (V8 13.6+, enabled by default)
- Node.js 22-23: `--experimental-wasm-imported-strings` flag required

## Proposal: Hand-written WAT

### Why WAT over Rust/wasm-bindgen

| Aspect | Hand-written WAT | Rust + wasm-bindgen |
|--------|------------------|---------------------|
| Overhead | Zero - direct builtins | Glue code overhead |
| Binary size | Minimal (~1-2KB) | Larger (~10KB+) |
| Dependencies | None (just wat2wasm) | Rust toolchain, wasm-pack |
| Complexity | Simple for small scope | Overkill for 3 functions |
| js-string-builtins | Direct imports | Indirect, still evolving |
| Contributor barrier | Low (WAT is simple) | Higher (Rust knowledge) |

For our limited scope (UTF-8 encode/decode), hand-written WAT is ideal.

### What to Implement in Wasm

1. **UTF-8 byte length counting** (`utf8Count`)
   - Iterate string via `charCodeAt`, calculate byte length

2. **UTF-8 encoding** (`utf8Encode`)
   - Read chars via `charCodeAt`, write UTF-8 bytes to linear memory

3. **UTF-8 decoding** (`utf8Decode`)
   - Read UTF-8 bytes from memory, build string via `fromCharCode`/`fromCodePoint`

### Available js-string-builtins

From `wasm:js-string`:
- `length` - get string length
- `charCodeAt` - get UTF-16 code unit at index
- `codePointAt` - get Unicode code point at index (handles surrogates)
- `fromCharCode` - create single-char string from code unit
- `fromCodePoint` - create single-char string from code point
- `concat` - concatenate strings
- `substring` - extract substring
- `equals` - compare strings

## Implementation Plan

### Phase 1: Project Setup

```
msgpack-javascript/
├── wasm/
│   ├── utf8.wat           # hand-written WAT source
│   └── build.sh           # wat2wasm + base64 generation
├── src/
│   └── utils/
│       ├── utf8.ts            # existing pure JS
│       ├── utf8-wasm.ts       # wasm loader + integration
│       └── utf8-wasm-binary.ts  # auto-generated base64 wasm
```

### Phase 2: WAT Implementation

```wat
;; wasm/utf8.wat
(module
  ;; Import js-string builtins
  ;; Note: string parameters use externref, string returns use (ref extern)
  (import "wasm:js-string" "length"
    (func $str_length (param externref) (result i32)))
  (import "wasm:js-string" "charCodeAt"
    (func $str_charCodeAt (param externref i32) (result i32)))
  (import "wasm:js-string" "fromCharCode"
    (func $str_fromCharCode (param i32) (result (ref extern))))
  (import "wasm:js-string" "concat"
    (func $str_concat (param externref externref) (result (ref extern))))

  ;; Linear memory for UTF-8 bytes (exported for JS access)
  (memory (export "memory") 1)

  ;; Count UTF-8 byte length of a JS string
  (func (export "utf8Count") (param $str externref) (result i32)
    (local $i i32)
    (local $len i32)
    (local $byteLen i32)
    (local $code i32)

    (local.set $len (call $str_length (local.get $str)))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $code
          (call $str_charCodeAt (local.get $str) (local.get $i)))

        ;; Count bytes based on code point range
        (if (i32.lt_u (local.get $code) (i32.const 0x80))
          (then
            (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 1))))
          (else (if (i32.lt_u (local.get $code) (i32.const 0x800))
            (then
              (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 2))))
            (else (if (i32.and
                        (i32.ge_u (local.get $code) (i32.const 0xD800))
                        (i32.le_u (local.get $code) (i32.const 0xDBFF)))
              ;; High surrogate - 4 bytes total, skip low surrogate
              (then
                (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 4)))
                (local.set $i (i32.add (local.get $i) (i32.const 1))))
              (else
                (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 3)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $continue)))

    (local.get $byteLen))

  ;; Encode JS string to UTF-8 bytes at offset, returns bytes written
  (func (export "utf8Encode") (param $str externref) (param $offset i32) (result i32)
    ;; Similar loop: charCodeAt -> encode -> store to memory
    (local $i i32)
    (local $len i32)
    (local $pos i32)
    (local $code i32)

    (local.set $len (call $str_length (local.get $str)))
    (local.set $pos (local.get $offset))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $code (call $str_charCodeAt (local.get $str) (local.get $i)))

        ;; 1-byte (ASCII)
        (if (i32.lt_u (local.get $code) (i32.const 0x80))
          (then
            (i32.store8 (local.get $pos) (local.get $code))
            (local.set $pos (i32.add (local.get $pos) (i32.const 1))))
          (else (if (i32.lt_u (local.get $code) (i32.const 0x800))
            ;; 2-byte
            (then
              (i32.store8 (local.get $pos)
                (i32.or (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0xC0)))
              (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                (i32.or (i32.and (local.get $code) (i32.const 0x3F)) (i32.const 0x80)))
              (local.set $pos (i32.add (local.get $pos) (i32.const 2))))
            ;; 3-byte or 4-byte (surrogate pair)
            (else
              ;; TODO: handle surrogates for 4-byte
              (i32.store8 (local.get $pos)
                (i32.or (i32.shr_u (local.get $code) (i32.const 12)) (i32.const 0xE0)))
              (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                (i32.or (i32.and (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0x3F)) (i32.const 0x80)))
              (i32.store8 (i32.add (local.get $pos) (i32.const 2))
                (i32.or (i32.and (local.get $code) (i32.const 0x3F)) (i32.const 0x80)))
              (local.set $pos (i32.add (local.get $pos) (i32.const 3)))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $continue)))

    (i32.sub (local.get $pos) (local.get $offset)))

  ;; Decode UTF-8 bytes from memory to JS string
  (func (export "utf8Decode") (param $offset i32) (param $length i32) (result externref)
    ;; Build string by reading bytes, decoding, calling fromCharCode + concat
    ;; ... implementation
    (call $str_fromCharCode (i32.const 0))) ;; placeholder
)
```

### Phase 3: Build Script

```bash
#!/bin/bash
# wasm/build.sh
# Requires: binaryen (brew install binaryen)

wasm-as utf8.wat -o utf8.wasm --enable-reference-types --enable-gc

# Generate base64-encoded TypeScript module
echo "// Auto-generated - do not edit" > ../src/utils/utf8-wasm-binary.ts
echo "export const wasmBinary = \"$(base64 -i utf8.wasm)\";" >> ../src/utils/utf8-wasm-binary.ts
```

### Phase 4: TypeScript Integration

```typescript
// src/utils/utf8-wasm-binary.ts (auto-generated)
export const wasmBinary = "AGFzbQEAAAA..."; // base64-encoded wasm

// src/utils/utf8-wasm.ts
import { utf8Count as utf8CountJs } from "./utf8.js";
import { wasmBinary } from "./utf8-wasm-binary.js";

interface WasmExports {
  memory: WebAssembly.Memory;
  utf8Count(str: string): number;
  utf8Encode(str: string, offset: number): number;
  utf8Decode(offset: number, length: number): string;
}

let wasm: WasmExports | null = null;

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Polyfill for js-string-builtins (used when native builtins unavailable)
const jsStringPolyfill = {
  "wasm:js-string": {
    length: (s: string) => s.length,
    charCodeAt: (s: string, i: number) => s.charCodeAt(i),
    codePointAt: (s: string, i: number) => s.codePointAt(i),
    fromCharCode: (code: number) => String.fromCharCode(code),
    fromCodePoint: (code: number) => String.fromCodePoint(code),
    concat: (a: string, b: string) => a + b,
    substring: (s: string, start: number, end: number) => s.substring(start, end),
    equals: (a: string, b: string) => a === b,
  },
};

// Synchronous initialization
function initWasm(): boolean {
  if (wasm) return true;

  try {
    const bytes = base64ToBytes(wasmBinary);
    // Try with builtins first (native support)
    // If builtins not supported, option is ignored and polyfill is used
    const module = new WebAssembly.Module(bytes, { builtins: ["js-string"] });
    const instance = new WebAssembly.Instance(module, jsStringPolyfill);
    wasm = instance.exports as WasmExports;
    return true;
  } catch {
    return false;  // Fallback to pure JS (utf8CountJs, etc.)
  }
}

// Try init at module load
const wasmAvailable = initWasm();

export function utf8Count(str: string): number {
  return wasm ? wasm.utf8Count(str) : utf8CountJs(str);
}
```

**Progressive enhancement:**
- Native builtins → engine ignores import object, uses optimized builtins
- No native builtins → engine uses polyfill from import object
- Wasm fails entirely → falls back to pure JS implementation

**Benefits of base64 inline:**
- No async initialization needed - sync `new WebAssembly.Module()`
- No fetch/network request - works in all environments
- Single file distribution - no separate .wasm asset
- Bundle size: ~1.3x wasm size (base64 overhead), but gzip compresses well

## Compatibility Matrix

| Environment | Native builtins | Wasm + polyfill | Pure JS fallback |
|-------------|-----------------|-----------------|------------------|
| Chrome 131+ | Yes | - | - |
| Firefox 134+ | Yes | - | - |
| Safari 18+ | TBD | Yes | - |
| Node.js 24+ | Yes (V8 13.6+) | - | - |
| Node.js 22-23 | Flag required | Yes | - |
| Deno | TBD | Yes | - |
| Older browsers | No | Yes | - |
| No Wasm support | - | - | Yes |

Three-tier fallback:
1. **Native builtins** - best performance (engine-optimized)
2. **Wasm + polyfill** - good performance (wasm logic, JS string ops)
3. **Pure JS** - baseline (current implementation)

## Benchmarking Strategy

1. Reuse existing benchmarks:
   - `benchmark/encode-string.ts`
   - `benchmark/decode-string.ts`

2. Add Wasm variants and compare across string sizes:
   - Short strings (< 50 bytes): likely JS faster due to call overhead
   - Medium strings (50-1000 bytes): Wasm should win
   - Large strings (> 1000 bytes): TextEncoder/TextDecoder still optimal

## Success Criteria

1. **Performance**: >= 1.5x speedup for medium strings (50-1000 bytes)
2. **Bundle size**: Wasm binary < 2KB (~2.7KB as base64, compresses well with gzip)
3. **Compatibility**: Zero breakage with fallback to pure JS
4. **Maintainability**: Simple WAT, easy to understand

## Decisions

- **Node.js**: js-string-builtins enabled by default in Node.js 24+ (V8 13.6+). For Node.js 22-23, use `--experimental-wasm-imported-strings` flag.

## References

- [js-string-builtins proposal](https://github.com/WebAssembly/js-string-builtins)
- [MDN: WebAssembly JavaScript builtins](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/JavaScript_builtins)
- [WebAssembly 3.0 announcement](https://webassembly.org/news/2025-09-17-wasm-3.0/)
- [Previous PR #26](https://github.com/msgpack/msgpack-javascript/pull/26)
- [Removal PR #95](https://github.com/msgpack/msgpack-javascript/pull/95)
