/* eslint-disable no-console */

// TODO: Use TypeScript built-in type
declare const WebAssembly: any;

export const WASM_DEBUG = !!(process && process.env.WASM_DEBUG === "true");

let wasmModule: any;
try {
  if (WASM_DEBUG) {
    wasmModule = require("../build/wasm/untouched.wasm.js").wasmModule;
  } else {
    wasmModule = require("../build/wasm/optimized.wasm.js").wasmModule;
  }
} catch (e) {
  if (WASM_DEBUG) {
    console.error(e);
  }
  // WebAssembly is not supported.
}

function abort(filename: number, line: number, column: number): void {
  throw new Error(`abort called at ${filename}:${line}:${column}`);
}

const defaultWasmInstance =
  wasmModule &&
  new WebAssembly.Instance(wasmModule, {
    env: {
      abort,
    },
  });

export const WASM_AVAILABLE = !!wasmModule && process.env.NO_WASM !== "true";

type pointer = number;

function setMemory(wasm: any, destPtr: pointer, src: Uint8Array, size: number) {
  const destView = new Uint8Array(wasm.exports.memory.buffer, destPtr, size);
  destView.set(src);
}

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
    setMemory(wasm, inputPtr, bytes.subarray(offset, offset + byteLength), byteLength);

    const outputArraySize = wasm.exports.utf8DecodeToUint16Array(outputPtr, inputPtr, byteLength);
    const codepoints = new Uint16Array(wasm.exports.memory.buffer, outputPtr, outputArraySize);

    // FIXME: split codepoints if it is too long (the maximum size depends on the JS engine, though).
    return String.fromCharCode.apply(String, codepoints as any);
  } finally {
    wasm.exports.free(inputPtr);
    wasm.exports.free(outputPtr);
  }
}
