export function utf8DecodeToUint16Array(outputPtr: usize, inputPtr: usize, byteLength: usize): usize {
  let inputOffset = inputPtr;
  let outputOffset = outputPtr;
  let inputOffsetEnd = inputOffset + byteLength;
  const u16s = sizeof<u16>();

  while (inputOffset < inputOffsetEnd) {
    let byte1: u16 = load<u8>(inputOffset++);
    if ((byte1 & 0x80) === 0) {
      // 1 byte
      store<u16>(outputOffset, byte1);
      outputOffset += u16s;
    } else if ((byte1 & 0xe0) === 0xc0) {
      // 2 bytes
      let byte2: u16 = load<u8>(inputOffset++) & 0x3f;
      // FIXME: consider endians
      store<u16>(outputOffset, ((byte1 & 0x1f) << 6) | byte2);
      outputOffset += u16s;
    } else if ((byte1 & 0xf0) === 0xe0) {
      // 3 bytes
      let byte2: u16 = load<u8>(inputOffset++) & 0x3f;
      let byte3: u16 = load<u8>(inputOffset++) & 0x3f;
      store<u16>(outputOffset, ((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
      outputOffset += u16s;
    } else if ((byte1 & 0xf8) === 0xf0) {
      // 4 bytes
      let byte2 = load<u8>(inputOffset++) & 0x3f;
      let byte3 = load<u8>(inputOffset++) & 0x3f;
      let byte4 = load<u8>(inputOffset++) & 0x3f;
      let codepoint: i32 = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
      if (codepoint > 0xffff) {
        codepoint -= 0x10000;
        store<u16>(outputOffset, ((codepoint >>> 10) & 0x3ff) | 0xd800);
        outputOffset += u16s;
        codepoint = 0xdc00 | (codepoint & 0x3ff);
      }
      store<u16>(outputOffset, codepoint);
      outputOffset += u16s;
    } else {
      // invalid UTF-8
      store<u16>(outputOffset++, byte1);
      outputOffset += u16s;
    }
  }
  return (outputOffset - outputPtr) / u16s;
}
