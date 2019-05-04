// the actual range is int53 (a.k.a. safe integer)
export function encodeUint64(value: number, view: DataView, offset: number): void {
  const high = value / 0x100000000;
  const low = value & 0xffffffff;

  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

// the actual range is int53 (a.k.a. safe integer)
export function encodeInt64(value: number, view: DataView, offset: number): void {
  if (value < 0) {
    const absMinusOne = -value - 1;
    const high = absMinusOne / 0x100000000;
    const low = absMinusOne & 0xffffffff;

    view.setUint8(offset, (((high >> 24) & 0xff) ^ 0xff) | 0x80);
    view.setUint8(offset + 1, ((high >> 16) & 0xff) ^ 0xff);
    view.setUint8(offset + 2, ((high >> 8) & 0xff) ^ 0xff);
    view.setUint8(offset + 3, (high & 0xff) ^ 0xff);
    view.setUint8(offset + 4, ((low >> 24) & 0xff) ^ 0xff);
    view.setUint8(offset + 5, ((low >> 16) & 0xff) ^ 0xff);
    view.setUint8(offset + 6, ((low >> 8) & 0xff) ^ 0xff);
    view.setUint8(offset + 7, (low & 0xff) ^ 0xff);
  } else {
    encodeUint64(value, view, offset);
  }
}

// the actual range is int53 (a.k.a. safe integer)
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
