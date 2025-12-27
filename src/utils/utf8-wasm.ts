/**
 * WebAssembly-based UTF-8 string processing using js-string-builtins with GC arrays.
 *
 * Environment variables:
 * - MSGPACK_WASM=force: Force wasm mode, throw error if wasm fails to load
 * - MSGPACK_WASM=never: Disable wasm, always use pure JS
 *
 * This implementation uses WASM GC arrays with intoCharCodeArray/fromCharCodeArray
 * for efficient bulk string operations instead of character-by-character processing.
 */

import { wasmBinary } from "./utf8-wasm-binary.ts";

// Check environment variable for wasm mode
declare const process: { env?: Record<string, string | undefined> } | undefined;

function getWasmMode(): "force" | "never" | "auto" {
  try {
    if (process?.env) {
      const mode = process.env["MSGPACK_WASM"];
      if (mode) {
        switch (mode.toLowerCase()) {
          case "force":
            return "force";
          case "never":
            return "never";
          default:
            return "auto";
        }
      }
    }
  } catch {
    // process may not be defined in browser
  }
  return "auto";
}

const WASM_MODE = getWasmMode();

// GC array type (opaque reference)
type I16Array = object;

interface WasmExports extends WebAssembly.Exports {
  memory: WebAssembly.Memory;
  utf8Count(str: string): number;
  utf8Encode(str: string, offset: number): number;
  utf8DecodeToArray(length: number, arr: I16Array): number;
  allocArray(size: number): I16Array;
  arrayToString(arr: I16Array, start: number, end: number): string;
}

let wasmInstance: WasmExports | null = null;
let wasmInitError: Error | null = null;

function base64ToBytes(base64: string): Uint8Array {
  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  // Node.js fallback
  return new Uint8Array(Buffer.from(base64, "base64"));
}

function tryInitializeWasmInstance(): void {
  if (WASM_MODE === "never") {
    wasmInitError = new Error("MSGPACK_WASM=never: wasm disabled");
    return;
  }

  try {
    if (typeof WebAssembly === "undefined") {
      throw new Error("WebAssembly not supported");
    }

    const bytes = base64ToBytes(wasmBinary);

    // Requires js-string builtins support (Node.js 24+ / Chrome 130+ / Firefox 134+)
    const module: WebAssembly.Module = new (WebAssembly.Module as any)(bytes, { builtins: ["js-string"] });
    const instance = new WebAssembly.Instance(module);
    wasmInstance = instance.exports as WasmExports;
  } catch (e) {
    wasmInitError = e instanceof Error ? e : new Error(String(e));

    if (WASM_MODE === "force") {
      throw new Error(`MSGPACK_WASM=force but wasm failed to load: ${wasmInitError.message}`, { cause: wasmInitError });
    }
  }
}

tryInitializeWasmInstance();

/**
 * Whether wasm is available and initialized.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const WASM_AVAILABLE = wasmInstance !== null;

export function getWasmError(): Error | null {
  return wasmInitError;
}

export function getWasmExports(): WasmExports | null {
  return wasmInstance;
}

/**
 * Count UTF-8 byte length of a string.
 */
export function utf8CountWasm(str: string): number {
  return wasmInstance!.utf8Count(str);
}

/**
 * Encode string to UTF-8 bytes in the provided buffer.
 * Returns the number of bytes written.
 */
export function utf8EncodeWasm(str: string, output: Uint8Array, outputOffset: number): number {
  // Estimate max byte length without a full pass over the string.
  // Each UTF-16 code unit can produce at most 3 UTF-8 bytes (BMP chars).
  // Surrogate pairs (2 code units) produce 4 bytes, so 3 bytes/code unit is safe.
  const maxByteLength = str.length * 3;

  // Ensure wasm memory is large enough
  const requiredPages = Math.ceil(maxByteLength / 65536);
  const currentPages = wasmInstance!.memory.buffer.byteLength / 65536;

  if (requiredPages > currentPages) {
    wasmInstance!.memory.grow(requiredPages - currentPages);
  }

  // Encode to wasm memory (uses intoCharCodeArray for bulk char extraction)
  const bytesWritten = wasmInstance!.utf8Encode(str, 0);

  // Copy from wasm memory to output buffer
  const wasmBytes = new Uint8Array(wasmInstance!.memory.buffer, 0, bytesWritten);
  output.set(wasmBytes, outputOffset);

  return bytesWritten;
}

/**
 * Decode UTF-8 bytes to string.
 * Uses GC arrays with fromCharCodeArray for efficient string creation.
 */
export function utf8DecodeWasm(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  // Handle empty input
  if (byteLength === 0) {
    return "";
  }

  // Ensure wasm memory is large enough for UTF-8 input
  const requiredPages = Math.ceil(byteLength / 65536);
  const currentPages = wasmInstance!.memory.buffer.byteLength / 65536;

  if (requiredPages > currentPages) {
    wasmInstance!.memory.grow(requiredPages - currentPages);
  }

  // Copy UTF-8 bytes to wasm linear memory at offset 0
  const wasmBytes = new Uint8Array(wasmInstance!.memory.buffer, 0, byteLength);
  wasmBytes.set(bytes.subarray(inputOffset, inputOffset + byteLength));

  // Allocate GC array for UTF-16 output (max size = byteLength for ASCII)
  const arr = wasmInstance!.allocArray(byteLength);

  // Decode UTF-8 to UTF-16 in GC array
  const codeUnits = wasmInstance!.utf8DecodeToArray(byteLength, arr);

  // Create string directly from GC array using fromCharCodeArray
  return wasmInstance!.arrayToString(arr, 0, codeUnits);
}
