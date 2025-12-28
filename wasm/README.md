# WebAssembly UTF-8 String Processing

## Background

### Previous Attempt (2019-2020)

- **PR #26**: Introduced AssemblyScript-based UTF-8 encode/decode
- **PR #95**: Removed it because "Wasm for UTF-8 encode/decode is not much faster than pureJS"

The main issues were:
1. JS-to-Wasm call overhead negated encoding gains
2. String copying between JS and Wasm memory was expensive
3. Maintenance burden wasn't justified by performance gains

### What Changed in 2025

**js-string-builtins** (WebAssembly 3.0) fundamentally changes the equation:

- Direct import of JS string operations from `wasm:js-string`
- No glue code overhead - operations can be inlined by the engine
- Uses WASM GC arrays with `intoCharCodeArray`/`fromCharCodeArray` for bulk operations

## Building

Requires [Binaryen](https://github.com/WebAssembly/binaryen) (`brew install binaryen`):

```bash
./build.sh
```

This compiles `utf8.wat` and generates `src/utils/utf8-wasm-binary.ts` with the base64-encoded binary.

## Runtime Requirements

| Environment | Support |
|-------------|---------|
| Node.js 24+ | Native (V8 13.6+) |
| Node.js 22-23 | `--experimental-wasm-imported-strings` flag |
| Chrome 131+ | Native |
| Firefox 134+ | Native |
| Safari | TBD |
| Older/unsupported | Falls back to pure JS |

## Architecture

Three-tier dispatch based on string/byte length:

| Length | Method | Reason |
|--------|--------|--------|
| ≤ 50 | Pure JS | Lowest call overhead |
| 51-1000 | WASM | Optimal for medium strings |
| > 1000 | TextEncoder/TextDecoder | SIMD-optimized for bulk |

## Optimization Attempts (2025)

Several optimization approaches were tested for `utf8Count`:

### 1. Bulk Array Copy (intoCharCodeArray)

**Hypothesis**: Replace N `charCodeAt` calls with 1 bulk `intoCharCodeArray` + N array reads.

**Result**: 17-29% slower. GC array allocation overhead outweighs boundary-crossing savings.

### 2. codePointAt Instead of charCodeAt

**Hypothesis**: Simplify surrogate pair handling with `codePointAt`.

**Result**: Slightly slower. `codePointAt` does more internal work to decode surrogates.

### 3. SIMD Processing

**Hypothesis**: Copy to linear memory, then use SIMD to process 8 chars at once.

**Result**: 23-49% slower. The O(n) copy from GC array to linear memory negates SIMD gains.

```
JS String → GC Array (1 call) → Linear Memory (N scalar ops) → SIMD
                                       ↑
                                 This kills SIMD
```

### Conclusion

The scalar `charCodeAt` loop is already near-optimal. The `js-string-builtins` implementation is highly optimized, making per-character calls very cheap. The 2-3x speedup over pure JS is about as good as it gets with current WASM capabilities.

## References

- [js-string-builtins proposal](https://github.com/WebAssembly/js-string-builtins)
- [MDN: WebAssembly JavaScript builtins](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/JavaScript_builtins)
