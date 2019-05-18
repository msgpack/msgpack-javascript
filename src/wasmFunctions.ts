// TODO: Use TypeScript built-in type
declare const WebAssembly: any;

// WASM=no - disable WASM functions
// WASM=force - force to use WASM functions
const WASM: string = process.env.MSGPACK_WASM || process.env.WASM || "";
export const NO_WASM = WASM === "no";
export const FORCE_WASM = WASM === "force";

let { wasmModule } = (() => {
  if (NO_WASM) {
    return {};
  }

  try {
    return require("../dist/wasm/msgpack.wasm.js");
  } catch (e) {
    if (FORCE_WASM) {
      throw e;
    }
    return {};
  }
})();

export const WASM_AVAILABLE = !!wasmModule;

// A hint to use WASM ver.
export const WASM_STR_THRESHOLD = FORCE_WASM ? 0 : 0x100;

function abort(filename: number, line: number, column: number): void {
  // FIXME: filename is just a number (pointer?)
  throw new Error(`abort called at ${filename}:${line}:${column}`);
}

const defaultWasmInstance =
  wasmModule &&
  new WebAssembly.Instance(wasmModule, {
    env: {
      abort,
    },
  });

type pointer = number;

function setMemoryU8(wasm: any, destPtr: pointer, src: Uint8Array, size: number) {
  const destView = new Uint8Array(wasm.exports.memory.buffer, destPtr, size);
  destView.set(src);
}

// for debugging purpose
export function utf8CountWasm(str: string, wasm = defaultWasmInstance): number {
  const strLength = str.length;

  // prepare inputPtr
  const inputLength = strLength * 2;
  // u16*
  const inputPtr: pointer = wasm.exports.malloc(inputLength);
  const inputView = new DataView(wasm.exports.memory.buffer, inputPtr, inputLength);
  for (let i = 0; i < strLength; i++) {
    inputView.setUint16(i * 2, str.charCodeAt(i));
  }

  try {
    return wasm.exports.utf8CountUint16Array(inputPtr, strLength);
  } finally {
    wasm.exports.free(inputPtr);
  }
}

/**
 * It encodes string to MessagePack str family (headByte/size + utf8 bytes).
 * @returns The whole byte length including headByte/size.
 */
export function utf8EncodeWasm(str: string, output: Uint8Array, wasm = defaultWasmInstance): number {
  const strLength = str.length;

  // prepare inputPtr
  const inputLength = strLength * 2;
  // u16*
  const inputPtr: pointer = wasm.exports.malloc(inputLength);

  const inputView = new DataView(wasm.exports.memory.buffer, inputPtr, inputLength);
  for (let i = 0; i < strLength; i++) {
    // to write u16 in big-endian
    inputView.setUint16(i * 2, str.charCodeAt(i));
  }

  // u8*
  const maxOutputHeaderSize = 1 + 4; // headByte + u32
  const outputPtr: pointer = wasm.exports.malloc(maxOutputHeaderSize + strLength * 4);
  try {
    const outputLength = wasm.exports.utf8EncodeUint16Array(outputPtr, inputPtr, strLength);
    output.set(new Uint8Array(wasm.exports.memory.buffer, outputPtr, outputLength));
    return outputLength;
  } finally {
    wasm.exports.free(inputPtr);
    wasm.exports.free(outputPtr);
  }
}

// A wrapper function for utf8DecodeToUint16Array()
export function utf8DecodeWasm(
  bytes: Uint8Array,
  offset: number,
  byteLength: number,
  wasm = defaultWasmInstance,
): string {
  const inputPtr: pointer = wasm.exports.malloc(byteLength);
  // in worst case, the UTF-16 array uses the same as byteLength * 2
  const outputPtr: pointer = wasm.exports.malloc(byteLength * 2);
  try {
    setMemoryU8(wasm, inputPtr, bytes.subarray(offset, offset + byteLength), byteLength);

    const outputArraySize = wasm.exports.utf8DecodeToUint16Array(outputPtr, inputPtr, byteLength);
    const codepoints = new Uint16Array(wasm.exports.memory.buffer, outputPtr, outputArraySize);

    // FIXME: split codepoints if it is too long (the maximum size depends on the JS engine, though).
    return String.fromCharCode.apply(String, codepoints as any);
  } finally {
    wasm.exports.free(inputPtr);
    wasm.exports.free(outputPtr);
  }
}
