/* eslint-disable no-console */

// TODO: Use TypeScript built-in type
declare const WebAssembly: any;

const NO_WASM = process.env.NO_WASM === "true" || process.env.MSGPACK_NO_WASM === "true";
export const WASM_DEBUG = process.env.WASM_DEBUG === "true" || process.env.MSGPACK_WASM_DEBUG === "true";

let { wasmModule } = (() => {
  if (NO_WASM) {
    return {};
  }

  try {
    if (WASM_DEBUG) {
      return require("../dist/wasm/untouched.wasm.js");
    } else {
      return require("../dist/wasm/optimized.wasm.js");
    }
  } catch (e) {
    if (WASM_DEBUG) {
      console.error("WebAssembly is not supported", e);
    }
    return {};
  }
})();

export const WASM_AVAILABLE = !!wasmModule;

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
function setMemoryU16(wasm: any, destPtr: pointer, src: Uint16Array, size: number) {
  const destView = new Uint16Array(wasm.exports.memory.buffer, destPtr, size);
  destView.set(src);
}

export function utf8CountWasm(units: Uint16Array, wasm = defaultWasmInstance): number {
  const inputPtr: pointer = wasm.exports.malloc(units.byteLength);
  try {
    setMemoryU16(wasm, inputPtr, units, units.length);
    return wasm.exports.utf8CountUint16Array(inputPtr, units.length);
  } finally {
    wasm.exports.free(inputPtr);
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
