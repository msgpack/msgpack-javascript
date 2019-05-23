import { utf8CountUint16Array } from "./utf8CountUint16Array";
import { storeUint8BE, storeUint16BE, storeUint32BE, loadUint16BE } from "./be";

function storeStringHeader(outputPtr: usize, utf8ByteLength: usize): usize {
  let ptr = outputPtr;
  if (utf8ByteLength < 32) {
    // fixstr
    storeUint8BE(ptr++, 0xa0 + (utf8ByteLength as u8));
  } else if (utf8ByteLength < 0x100) {
    // str 8
    storeUint8BE(ptr++, 0xd9);
    storeUint8BE(ptr++, utf8ByteLength as u8);
  } else if (utf8ByteLength < 0x10000) {
    // str 16
    storeUint8BE(ptr++, 0xda);
    storeUint16BE(ptr, utf8ByteLength as u16);
    ptr += sizeof<u16>();
  } else if ((utf8ByteLength as u64) < 0x100000000) {
    // str 32
    storeUint8BE(ptr++, 0xdb);
    storeUint32BE(ptr, utf8ByteLength as u32);
    ptr += sizeof<u32>();
  } else {
    throw new Error(`Too long string: ${utf8ByteLength} bytes in UTF-8`);
  }
  return ptr;
}

// outputPtr: u8*
// inputPtr: u16*
// It adds MessagePack str head bytes to the output
export function utf8EncodeUint16Array(outputPtr: usize, inputPtr: usize, inputLength: usize): usize {
  let utf8ByteLength = utf8CountUint16Array(inputPtr, inputLength);
  let strHeaderOffset = storeStringHeader(outputPtr, utf8ByteLength);

  const u16s = sizeof<u16>();
  let inputOffset = inputPtr;
  let inputEnd = inputPtr + inputLength * u16s;
  let outputOffset = strHeaderOffset;
  while (inputOffset < inputEnd) {
    let value: u32 = loadUint16BE(inputOffset);
    inputOffset += u16s;

    if ((value & 0xffffff80) === 0) {
      // 1-byte
      store<u8>(outputOffset++, value);
      continue;
    } else if ((value & 0xfffff800) === 0) {
      // 2-bytes
      store<u8>(outputOffset++, ((value >> 6) & 0x1f) | 0xc0);
    } else {
      // handle surrogate pair
      if (value >= 0xd800 && value <= 0xdbff) {
        // high surrogate
        if (inputOffset < inputEnd) {
          let extra: u32 = loadUint16BE(inputOffset);
          if ((extra & 0xfc00) === 0xdc00) {
            inputOffset += u16s;
            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
          }
        }
      }

      if ((value & 0xffff0000) === 0) {
        // 3-byte
        store<u8>(outputOffset++, ((value >> 12) & 0x0f) | 0xe0);
        store<u8>(outputOffset++, ((value >> 6) & 0x3f) | 0x80);
      } else {
        // 4-byte
        store<u8>(outputOffset++, ((value >> 18) & 0x07) | 0xf0);
        store<u8>(outputOffset++, ((value >> 12) & 0x3f) | 0x80);
        store<u8>(outputOffset++, ((value >> 6) & 0x3f) | 0x80);
      }
    }

    store<u8>(outputOffset++, (value & 0x3f) | 0x80);
  }

  return outputOffset - outputPtr;
}
