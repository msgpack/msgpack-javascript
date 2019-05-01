export function encodeUint32(value: number): [number, number, number, number] {
  return [(value >>> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

export function decodeUint32(b1: number, b2: number, b3: number, b4: number) {
  // do not use `b1 << 32` because JavaScript only handles 32-bit integer for bitwise operations
  return b1 * 0x1000000 + (b2 << 16) + (b3 << 8) + b4;
}

export const encodeInt32 = encodeUint32;

export function decodeInt32(b1: number, b2: number, b3: number, b4: number): number {
  const v = decodeUint32(b1, b2, b3, b4);
  return v < 0x80000000 ? v : v - 0x100000000;
}

// the actual range is int52 (a.k.a. safe integer)
export function encodeInt64(value: number): [number, number, number, number, number, number, number, number] {
  if (value < 0) {
    const absMinusOne = -value - 1;
    const high = absMinusOne / 0x100000000;
    const low = absMinusOne & 0xffffffff;
    return [
      (((high >> 24) & 0xff) ^ 0xff) | 0x80,
      ((high >> 16) & 0xff) ^ 0xff,
      ((high >> 8) & 0xff) ^ 0xff,
      (high & 0xff) ^ 0xff,
      ((low >> 24) & 0xff) ^ 0xff,
      ((low >> 16) & 0xff) ^ 0xff,
      ((low >> 8) & 0xff) ^ 0xff,
      (low & 0xff) ^ 0xff,
    ];
  } else {
    const high = value / 0x100000000;
    const low = value & 0xffffffff;
    return [
      (high >> 24) & 0xff,
      (high >> 16) & 0xff,
      (high >> 8) & 0xff,
      high & 0xff,
      (low >> 24) & 0xff,
      (low >> 16) & 0xff,
      (low >> 8) & 0xff,
      low & 0xff,
    ];
  }
}

export function decodeInt64(
  b1: number,
  b2: number,
  b3: number,
  b4: number,
  b5: number,
  b6: number,
  b7: number,
  b8: number,
): number {
  if (b1 & 0x80) {
    // to avoid overflow
    return -(
      (b1 ^ 0xff) * 0x100000000000000 +
      (b2 ^ 0xff) * 0x1000000000000 +
      (b3 ^ 0xff) * 0x10000000000 +
      (b4 ^ 0xff) * 0x100000000 +
      (b5 ^ 0xff) * 0x1000000 +
      (b6 ^ 0xff) * 0x10000 +
      (b7 ^ 0xff) * 0x100 +
      (b8 ^ 0xff) +
      1
    );
  }
  return (
    b1 * 0x100000000000000 +
    b2 * 0x1000000000000 +
    b3 * 0x10000000000 +
    b4 * 0x100000000 +
    b5 * 0x1000000 +
    b6 * 0x10000 +
    b7 * 0x100 +
    b8
  );
}

export function encodeUint64(value: number): [number, number, number, number, number, number, number, number] {
  const high = value / 0x100000000;
  const low = value & 0xffffffff;

  return [
    (high >> 24) & 0xff,
    (high >> 16) & 0xff,
    (high >> 8) & 0xff,
    high & 0xff,
    (low >> 24) & 0xff,
    (low >> 16) & 0xff,
    (low >> 8) & 0xff,
    low & 0xff,
  ];
}
