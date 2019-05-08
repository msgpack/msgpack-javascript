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
    const high = absMinusOne / 0x1_0000_0000;
    const low = absMinusOne & 0xffff_ffff;

    view.setUint32(offset, (high ^ 0xffff_ffff) | 0x8000_0000);
    view.setUint32(offset + 4, low ^ 0xffff_ffff);
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
