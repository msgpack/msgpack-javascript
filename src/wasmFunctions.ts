// WASM=never - disable WASM functions
// WASM=force - force to use WASM functions
const WASM: string = process.env.MSGPACK_WASM || process.env.WASM || "";
export const NO_WASM = WASM === "never";
export const FORCE_WASM = WASM === "force";

type pointer = number;

// WM stands for WasmModule, but not the WebAssembly.Module instance but the WebAssembly.Instance.prototype.exports
const wm: any = (() => {
  if (NO_WASM) {
    return null;
  }

  try {
    return require("../dist/wasm/msgpack.wasm.js");
  } catch (e) {
    if (FORCE_WASM) {
      throw e;
    }
    return null;
  }
})();

export const WASM_AVAILABLE = !!wm;

// A hint of when to use WASM ver.
export const WASM_STR_THRESHOLD = FORCE_WASM ? 0 : 1024;

function setMemoryU8(destPtr: pointer, src: Uint8Array, size: number) {
  const destView = new Uint8Array(wm.memory.buffer, destPtr, size);
  destView.set(src);
}

function setMemoryStr(destPtr: pointer, destByteLength: number, str: string, strLength: number) {
  const inputView = new DataView(wm.memory.buffer, destPtr, destByteLength);
  for (let i = 0; i < strLength; i++) {
    inputView.setUint16(i * 2, str.charCodeAt(i));
  }
}

/**
 * It encodes string to MessagePack str family (headByte/size + utf8 bytes).
 * @returns The whole byte length including headByte/size.
 */
export function utf8EncodeWasm(str: string, output: Uint8Array, outputOffset: number): number {
  const strLength = str.length;
  const inputByteLength = strLength * 2;
  const inputU16BePtr: pointer = wm.malloc(inputByteLength);
  setMemoryStr(inputU16BePtr, inputByteLength, str, strLength);

  const maxOutputHeaderSize = 1 + 4; // headByte + u32
  const outputPtr: pointer = wm.malloc(maxOutputHeaderSize + strLength * 4);
  try {
    const outputLength = wm.utf8EncodeUint16Array(outputPtr, inputU16BePtr, strLength);
    output.set(new Uint8Array(wm.memory.buffer, outputPtr, outputLength), outputOffset);
    return outputLength;
  } finally {
    wm.free(inputU16BePtr);
    wm.free(outputPtr);
  }
}

const CHUNK_SIZE = 0x10_000;

function safeStringFromCharCodeU16(units: Uint16Array) {
  if (units.length <= CHUNK_SIZE) {
    // `String.fromCharCode.apply()` is faster than `String.fromCharCode(...units)`
    // in case `units` is a typed array
    return String.fromCharCode.apply(String, units as any);
  }

  let result = "";
  for (let i = 0; i < units.length; i++) {
    const chunk = units.subarray(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    result += String.fromCharCode.apply(String, chunk as any);
  }
  return result;
}

// A wrapper function for utf8DecodeToUint16Array()
export function utf8DecodeWasm(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  const inputPtr: pointer = wm.malloc(byteLength);
  // in worst case, the UTF-16 array uses the same as byteLength * 2
  const outputPtr: pointer = wm.malloc(byteLength * 2);
  try {
    setMemoryU8(inputPtr, bytes.subarray(inputOffset, inputOffset + byteLength), byteLength);

    const outputArraySize = wm.utf8DecodeToUint16Array(outputPtr, inputPtr, byteLength);
    const units = new Uint16Array(wm.memory.buffer, outputPtr, outputArraySize);
    return safeStringFromCharCodeU16(units);
  } finally {
    wm.free(inputPtr);
    wm.free(outputPtr);
  }
}
