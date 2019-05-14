import fs from "fs";

declare var WebAssembly: any;

const wasmModule = new WebAssembly.Module(fs.readFileSync(__dirname + "/build/wasm/optimized.wasm"));
const wasmInstance = new WebAssembly.Instance(wasmModule);
let instanceMemory = new Uint8Array(wasmInstance.exports.memory.buffer);

export function utf8Decode2(bytes: Uint8Array, offset: number, byteLength: number): string {
  const workingMemorySize = bytes.length * 3; // input(utf8) + output(utf16)
  if (instanceMemory.length < workingMemorySize) {
    const page = Math.ceil((workingMemorySize - instanceMemory.length) / 0x10000);
    wasmInstance.exports.memory.grow(page);
    instanceMemory = new Uint8Array(wasmInstance.exports.memory.buffer);
  }

  instanceMemory.set(bytes.subarray(offset, offset + byteLength));
  // console.log(instanceMemory.subarray(0, 10));

  const outputStart = Math.ceil(byteLength / 2) * 2;
  const outputEnd = wasmInstance.exports.utf8ToUtf16(byteLength, outputStart);
  const utf16array = new Uint16Array(wasmInstance.exports.memory.buffer, outputStart, (outputEnd - outputStart) / 2);
  // console.log([byteLength, outputStart, outputEnd]);
  // console.log(instanceMemory.subarray(0, 10));
  // console.log(utf16array);
  return String.fromCharCode(...utf16array);
}
