import { loadUint16BE } from "./be";

// inputPtr: u16*
export function utf8CountUint16Array(inputPtr: usize, inputLength: usize): usize {
  const u16s = sizeof<u16>();

  let byteLength: usize = 0;
  let pos: usize = inputPtr;
  let end = inputPtr + inputLength * u16s;
  while (pos < end) {
    let value: u32 = loadUint16BE(pos);
    pos += u16s;

    if ((value & 0xffffff80) === 0) {
      // 1-byte
      byteLength++;
      continue;
    } else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      byteLength += 2;
    } else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
        // high surrogate
        if (pos < end) {
          let extra: u32 = loadUint16BE(pos);
          if ((extra & 0xfc00) === 0xdc00) {
            pos += u16s;
            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
          }
        }
        if (value >= 0xd800 && value <= 0xdbff) {
          continue; // drop lone surrogate
        }
      }

      if ((value & 0xffff0000) === 0) {
        // 3-byte
        byteLength += 3;
      } else {
        // 4-byte
        byteLength += 4;
      }
    }
  }
  return byteLength;
}
