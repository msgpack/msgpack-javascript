---
name: typed-arrays
description: |
  Modern TypedArray and ArrayBuffer features including resizable buffers,
  transfer operations, Float16Array, and Uint8Array base64/hex encoding.
compatibility: Node.js 20+ and all the modern browsers
---

# Modern Typed Arrays

## ES2023: Change Array by Copy

Immutable operations returning new arrays:

```typescript
const arr = new Uint8Array([3, 1, 2]);

arr.toReversed();              // Uint8Array [2, 1, 3]
arr.toSorted((a, b) => a - b); // Uint8Array [1, 2, 3]
arr.with(0, 99);               // Uint8Array [99, 1, 2]
```

## ES2023: findLast / findLastIndex

```typescript
const arr = new Uint8Array([1, 2, 3, 2, 1]);

arr.findLast(x => x === 2);       // 2
arr.findLastIndex(x => x === 2);  // 3
```

## ES2024: Resizable ArrayBuffer

```typescript
const buffer = new ArrayBuffer(16, { maxByteLength: 1024 });

buffer.resizable;      // true
buffer.maxByteLength;  // 1024
buffer.resize(64);     // grow
buffer.resize(8);      // shrink
```

### Growable SharedArrayBuffer

```typescript
const shared = new SharedArrayBuffer(16, { maxByteLength: 1024 });
shared.growable;  // true
shared.grow(64);  // can only grow, not shrink
```

### TypedArray tracks resizable buffer

```typescript
const buffer = new ArrayBuffer(16, { maxByteLength: 64 });
const view = new Uint8Array(buffer);
view.length;        // 16
buffer.resize(32);
view.length;        // 32 (auto-tracks)
```

## ES2024: ArrayBuffer Transfer

```typescript
const buffer = new ArrayBuffer(16);
const arr = new Uint8Array(buffer);
arr[0] = 42;

const newBuffer = buffer.transfer();  // zero-copy transfer
buffer.detached;       // true
newBuffer.byteLength;  // 16

// Transfer with resize
const grown = buffer.transfer(64);

// Convert resizable to fixed
const fixed = resizable.transferToFixedLength();
```

## ES2025: Float16Array

```typescript
const f16 = new Float16Array(4);
const f16arr = Float16Array.of(1.5, 2.5, 3.5);

Float16Array.BYTES_PER_ELEMENT;  // 2
// Range: ±65504 (max), ±6.1e-5 (min positive)
```

### DataView Float16

```typescript
const view = new DataView(buffer);
view.setFloat16(0, 3.14, true);   // little-endian
view.getFloat16(0, true);         // ≈3.140625
```

## ES2026: Uint8Array Base64

Not yet in Node.js v24.

### Base64

```typescript
const bytes = new Uint8Array([72, 101, 108, 108, 111]);

bytes.toBase64();                          // "SGVsbG8="
bytes.toBase64({ alphabet: "base64url" }); // URL-safe
bytes.toBase64({ omitPadding: true });     // no trailing =

Uint8Array.fromBase64("SGVsbG8=");
Uint8Array.fromBase64("SGVsbG8", { alphabet: "base64url" });

// Write to existing buffer
const { read, written } = target.setFromBase64("SGVsbG8=");
```
