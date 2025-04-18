/**
 * Copyright 2019 The MessagePack Community.
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 * THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING
 * FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 * CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
// Integer Utility

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

export function getInt64(view: DataView, offset: number): number {
  const high = view.getInt32(offset);
  const low = view.getUint32(offset + 4);
  return high * 0x1_0000_0000 + low;
}

export function getUint64(view: DataView, offset: number): number {
  const high = view.getUint32(offset);
  const low = view.getUint32(offset + 4);
  return high * 0x1_0000_0000 + low;
}
