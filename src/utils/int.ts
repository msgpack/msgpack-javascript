// Integer Utility

/**
 * An enum of different options for decoding integers.
 */
export enum IntMode {
  /**
   * Always returns the value as a number. Be aware that there will be a loss of precision if the
   * value is outside the range of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER.
   */
  UNSAFE_NUMBER,
  /**
   * Always returns the value as a number, but throws an error if the value is outside of the range
   * of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER.
   */
  SAFE_NUMBER,
  /**
   * Returns all values inside the range of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER as
   * numbers and all values outside that range as bigints.
   */
  MIXED,
  /**
   * Always returns the value as a bigint, even if it is small enough to safely fit in a number.
   */
  BIGINT,
}

export const UINT32_MAX = 0xffff_ffff;

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

export function getInt64(view: DataView, offset: number, mode: IntMode.UNSAFE_NUMBER | IntMode.SAFE_NUMBER): number
export function getInt64(view: DataView, offset: number, mode: IntMode.BIGINT): bigint
export function getInt64(view: DataView, offset: number, mode: IntMode): number | bigint
export function getInt64(view: DataView, offset: number, mode: IntMode): number | bigint {
  if (mode === IntMode.UNSAFE_NUMBER || mode === IntMode.SAFE_NUMBER) {
    // for compatibility, don't use view.getBigInt64 if the user hasn't told us to use BigInts
    const high = view.getInt32(offset);
    const low = view.getUint32(offset + 4);

    if (mode === IntMode.SAFE_NUMBER && (
      high < Math.floor(Number.MIN_SAFE_INTEGER / 0x1_0000_0000) ||
      (high === Math.floor(Number.MIN_SAFE_INTEGER / 0x1_0000_0000) && low === 0) ||
      high > (Number.MAX_SAFE_INTEGER - low) / 0x1_0000_0000
    )) {
      const hexValue = `${high < 0 ? "-" : ""}0x${Math.abs(high).toString(16)}${low.toString(16).padStart(8, "0")}`;
      throw new Error(`Mode is IntMode.SAFE_NUMBER and value is not a safe integer: ${hexValue}`);
    }

    return high * 0x1_0000_0000 + low;
  }

  const value = view.getBigInt64(offset);

  if (mode === IntMode.MIXED && value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }

  return value;
}

export function getUint64(view: DataView, offset: number, mode: IntMode.UNSAFE_NUMBER | IntMode.SAFE_NUMBER): number
export function getUint64(view: DataView, offset: number, mode: IntMode.BIGINT): bigint
export function getUint64(view: DataView, offset: number, mode: IntMode): number | bigint
export function getUint64(view: DataView, offset: number, mode: IntMode): number | bigint {
  if (mode === IntMode.UNSAFE_NUMBER || mode === IntMode.SAFE_NUMBER) {
    // for compatibility, don't use view.getBigUint64 if the user hasn't told us to use BigInts
    const high = view.getUint32(offset);
    const low = view.getUint32(offset + 4);

    if (mode === IntMode.SAFE_NUMBER && high > (Number.MAX_SAFE_INTEGER - low) / 0x1_0000_0000) {
      const hexValue = `0x${high.toString(16)}${low.toString(16).padStart(8, "0")}`;
      throw new Error(`Mode is IntMode.SAFE_NUMBER and value is not a safe integer: ${hexValue}`);
    }

    return high * 0x1_0000_0000 + low;
  }

  const value = view.getBigUint64(offset);

  if (mode === IntMode.MIXED && value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  }

  return value;
}

/**
 * Convert a safe integer Number (i.e. in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)
 * with respect to the given IntMode. For all modes except IntMode.BIGINT, this returns the original
 * Number unmodified.
 */
export function convertSafeIntegerToMode(value: number, mode: IntMode): number | bigint {
  if (mode === IntMode.BIGINT) {
    return BigInt(value);
  }

  return value;
}
