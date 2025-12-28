---
name: wasm
description: |
  Modern WebAssembly (Wasm) development expertise covering modern Wasm features
  and optimization techniques. Use this skill when working with WebAssembly
  modules or optimizing Wasm performance.
compatibility: WebAssembly v3.0 and later
---

# WebAssembly Development Skill

## WAT Syntax

Use **folded (S-expression) syntax** for readability:

```wat
;; Folded syntax (preferred)
(i32.add (local.get $x) (local.get $y))

;; Flat syntax (avoid)
local.get $x
local.get $y
i32.add
```

## WebAssembly Features

### Memory64 (64-bit Address Space)
- Memories and tables use `i64` as address type
- Expands addressable space from 4GB to 16 exabytes
- Syntax: `(memory i64 1)` instead of `(memory 1)`

### Multiple Memories
```wat
(module
  (memory $main 1)
  (memory $scratch 1))
```

### Tail Call Optimization
- Efficient recursion via `return_call` and `return_call_indirect`
- Prevents stack overflow for tail-recursive functions
```wat
(func $factorial (param $n i64) (param $acc i64) (result i64)
  (if (result i64) (i64.eqz (local.get $n))
    (then (local.get $acc))
    (else (return_call $factorial
      (i64.sub (local.get $n) (i64.const 1))
      (i64.mul (local.get $n) (local.get $acc))))))
```

### Exception Handling
- Native try/catch/throw semantics
- Interoperates with JavaScript exceptions
```wat
(tag $error (param i32))
(func $may_throw
  (throw $error (i32.const 42)))
```

### Relaxed SIMD
- Hardware-dependent SIMD optimizations beyond fixed-width 128-bit
- `i8x16.relaxed_swizzle`, `f32x4.relaxed_madd`, etc.

### WasmGC
- Native garbage-collected types: `struct`, `array`
- Instructions: `array.new`, `array.get`, `array.set`, `struct.new`, `struct.get`
- Reference types: `(ref $type)`, `(ref null $type)`

### externref
- Opaque reference to host (JS) objects
- Cannot be inspected or modified in Wasm, only passed around
- Used with js-string-builtins for efficient string handling

### js-string-builtins
- Import `"wasm:js-string"` for direct JS string operations
- Functions: `length`, `charCodeAt`, `fromCharCodeArray`, `intoCharCodeArray`
- Avoids costly JS↔Wasm boundary crossings for string processing

### SIMD Example
```wat
;; Process 16 bytes at a time
(v128.store (local.get $dst)
  (i8x16.add
    (v128.load (local.get $src1))
    (v128.load (local.get $src2))))
```

## Toolchain (Binaryen)

| Task | Command |
|------|---------|
| Assemble WAT to Wasm | `wasm-as module.wat -o module.wasm` |
| Disassemble Wasm to WAT | `wasm-dis module.wasm -o module.wat` |
| Optimize for size | `wasm-opt -Oz in.wasm -o out.wasm` |
| Optimize for speed | `wasm-opt -O3 in.wasm -o out.wasm` |

## Resources

- [WebAssembly Specification](https://webassembly.github.io/spec/)
- [Binaryen](https://github.com/WebAssembly/binaryen)
