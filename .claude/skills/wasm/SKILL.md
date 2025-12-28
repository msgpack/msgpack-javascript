---
name: wasm
description: |
  Modern WebAssembly (WASM) development expertise covering WASM 3.0 features
  and optimization techniques. Use this skill when working with WebAssembly
  modules, optimizing WASM performance, or integrating WASM with JavaScript/TypeScript.
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

## WebAssembly 3.0 Features

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
| Assemble WAT to WASM | `wasm-as module.wat -o module.wasm` |
| Disassemble WASM to WAT | `wasm-dis module.wasm -o module.wat` |
| Optimize for size | `wasm-opt -Oz in.wasm -o out.wasm` |
| Optimize for speed | `wasm-opt -O3 in.wasm -o out.wasm` |

## JavaScript/TypeScript Integration

### Instantiation
```typescript
const module = await WebAssembly.compileStreaming(fetch('module.wasm'));
const instance = await WebAssembly.instantiate(module, imports);
```

### Memory Access
```typescript
const memory = new WebAssembly.Memory({ initial: 1, maximum: 100 });
const buffer = new Uint8Array(instance.exports.memory.buffer);
buffer.set(data, offset);
```

## Resources

- [WebAssembly Specification](https://webassembly.github.io/spec/)
- [Binaryen](https://github.com/WebAssembly/binaryen)
