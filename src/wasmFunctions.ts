// TODO: Use TypeScript built-in type
declare const WebAssembly: any;

// WASM=no - disable WASM functions
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
export function utf8EncodeWasm(str: string, output: Uint8Array): number {
  const strLength = str.length;
  const inputByteLength = strLength * 2;
  const inputU16BePtr: pointer = wm.malloc(inputByteLength);
  setMemoryStr(inputU16BePtr, inputByteLength, str, strLength);

  const maxOutputHeaderSize = 1 + 4; // headByte + u32
  const outputPtr: pointer = wm.malloc(maxOutputHeaderSize + strLength * 4);
  try {
    const outputLength = wm.utf8EncodeUint16Array(outputPtr, inputU16BePtr, strLength);
    output.set(new Uint8Array(wm.memory.buffer, outputPtr, outputLength));
    return outputLength;
  } finally {
    wm.free(inputU16BePtr);
    wm.free(outputPtr);
  }
}

// A wrapper function for utf8DecodeToUint16Array()
export function utf8DecodeWasm(bytes: Uint8Array, offset: number, byteLength: number): string {
  const inputPtr: pointer = wm.malloc(byteLength);
  // in worst case, the UTF-16 array uses the same as byteLength * 2
  const outputPtr: pointer = wm.malloc(byteLength * 2);
  try {
    setMemoryU8(inputPtr, bytes.subarray(offset, offset + byteLength), byteLength);

    const outputArraySize = wm.utf8DecodeToUint16Array(outputPtr, inputPtr, byteLength);
    const codepoints = new Uint16Array(wm.memory.buffer, outputPtr, outputArraySize);

    // FIXME: split codepoints if it is too long (the maximum size depends on the JS engine, though).
    return String.fromCharCode.apply(String, codepoints as any);
  } finally {
    wm.free(inputPtr);
    wm.free(outputPtr);
  }
}
