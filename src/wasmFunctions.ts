let wasmModule: any;
try {
  wasmModule = require("../build/wasm/optimized.wasm.js").wasmModule;
} catch {
  // WebAssembly is not supported.
}

declare var WebAssembly: any;
const WASM_MEMORY_PAGE_SIZE = 0x10000; // 64KiB

const defaultWasmInstance = wasmModule && new WebAssembly.Instance(wasmModule);

export const WASM_AVAILABLE = !!wasmModule && process.env.NO_WASM !== "true";

function copyArrayBuffer(dest: ArrayBuffer, src: Uint8Array) {
  const destView = new Uint8Array(dest);
  destView.set(src);
}

export function utf8DecodeWasm(
  bytes: Uint8Array,
  offset: number,
  byteLength: number,
  wasmInstance = defaultWasmInstance,
): string {
  if (!wasmInstance) {
    throw new Error("No WebAssembly available");
  }

  const currentMemorySize: number = wasmInstance.exports.memory.buffer.byteLength;
  const requiredMemorySize = bytes.length * 3; // input(utf8) + output(utf16)
  if (currentMemorySize < requiredMemorySize) {
    const page = Math.ceil((requiredMemorySize - currentMemorySize) / WASM_MEMORY_PAGE_SIZE);
    wasmInstance.exports.memory.grow(page);
  }

  copyArrayBuffer(wasmInstance.exports.memory.buffer, bytes.subarray(offset, offset + byteLength));
  // console.log(instanceMemory.subarray(0, 10));

  const outputStart = Math.ceil(byteLength / Uint16Array.BYTES_PER_ELEMENT) * Uint16Array.BYTES_PER_ELEMENT;
  const outputEnd = wasmInstance.exports.utf8ToUtf16(byteLength, outputStart);
  const codepoints = new Uint16Array(
    wasmInstance.exports.memory.buffer,
    outputStart,
    (outputEnd - outputStart) / Uint16Array.BYTES_PER_ELEMENT,
  );
  // console.log([byteLength, outputStart, outputEnd]);
  // console.log(instanceMemory.subarray(0, 10));
  // console.log(utf16array);
  return String.fromCharCode.apply(String, codepoints as any);
}
