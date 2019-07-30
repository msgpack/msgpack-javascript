// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)

export function setUint64(view: DataView, offset: number, value: number): void {
  const high = value / 0x1_0000_0000;
  const low = value; // high bits are truncated by DataView
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function setInt64(view: DataView, offset: number, value: number): void {
  const high = Math.floor(value / 0x1_0000_0000);
  const low = value; // high bits are truncated by DataView
  view.setUint32(offset, high);
  view.setUint32(offset + 4, low);
}

export function getInt64(view: DataView, offset: number) {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);
  return high * 0x1_0000_0000 + low;
}

export function getUint64(view: DataView, offset: number) {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);
  return high * 0x1_0000_0000 + low;
}

// fix for IE which doesn't have isSafeInteger and isInteger
// from Polyfill on developer.mozilla.org

export function isSafeInteger(value: number) {
  if (Number.isSafeInteger) {
    return Number.isSafeInteger(value);
  }
  if (Number.isInteger) {
    return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
  }
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
}