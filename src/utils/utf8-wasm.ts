/**
 * WebAssembly-based UTF-8 string processing using js-string-builtins.
 *
 * Environment variables:
 * - MSGPACK_WASM=force: Force wasm mode, throw error if wasm fails to load
 * - MSGPACK_WASM=never: Disable wasm, always use pure JS
 *
 * Three-tier fallback:
 * 1. Native js-string-builtins (Chrome 130+, Firefox 134+)
 * 2. Wasm + polyfill (older browsers with WebAssembly)
 * 3. Pure JS (no WebAssembly support)
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

interface WasmExports {
  memory: WebAssembly.Memory;
  utf8Count(str: string): number;
  utf8Encode(str: string, offset: number): number;
  utf8Decode(offset: number, length: number): string;
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

// Polyfill for js-string-builtins (used when native builtins unavailable)
const jsStringPolyfill = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "wasm:js-string": {
    length: (s: string) => s.length,
    charCodeAt: (s: string, i: number) => s.charCodeAt(i),
    fromCharCode: (code: number) => String.fromCharCode(code),
    concat: (a: string, b: string) => a + b,
  },
};

function tryInitWasm(): void {
  if (wasmInstance !== null || wasmInitError !== null) {
    return; // Already initialized or failed
  }

  if (WASM_MODE === "never") {
    wasmInitError = new Error("MSGPACK_WASM=never: wasm disabled");
    return;
  }

  try {
    if (typeof WebAssembly === "undefined") {
      throw new Error("WebAssembly not supported");
    }

    const bytes = base64ToBytes(wasmBinary);

    // Try with builtins option (native support)
    // If builtins not supported, option is ignored and polyfill is used


    const module: WebAssembly.Module = new (WebAssembly.Module as any)(bytes, { builtins: ["js-string"] });


    const instance = new (WebAssembly.Instance)(module, jsStringPolyfill);
    wasmInstance = instance.exports as unknown as WasmExports;
  } catch (e) {
    wasmInitError = e instanceof Error ? e : new Error(String(e));

    if (WASM_MODE === "force") {
      throw new Error(`MSGPACK_WASM=force but wasm failed to load: ${wasmInitError.message}`);
    }
  }
}

// Initialize on module load
tryInitWasm();

/**
 * Whether wasm is available and initialized.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const WASM_AVAILABLE = (wasmInstance !== null);

/**
 * Get the wasm initialization error, if any.
 */
export function getWasmError(): Error | null {
  return wasmInitError;
}

/**
 * Get the raw wasm exports for advanced usage.
 */
export function getWasmExports(): WasmExports | null {
  return wasmInstance;
}

/**
 * Count UTF-8 byte length of a string.
 */
export function utf8CountWasm(str: string): number {
  if (wasmInstance === null) {
    throw new Error("wasm not initialized");
  }
  return wasmInstance.utf8Count(str);
}

/**
 * Encode string to UTF-8 bytes in the provided buffer.
 * Returns the number of bytes written.
 */
export function utf8EncodeWasm(str: string, output: Uint8Array, outputOffset: number): number {
  if (wasmInstance === null) {
    throw new Error("wasm not initialized");
  }

  // Ensure wasm memory is large enough
  const byteLength = wasmInstance.utf8Count(str);
  const requiredPages = Math.ceil((outputOffset + byteLength) / 65536);
  const currentPages = wasmInstance.memory.buffer.byteLength / 65536;

  if (requiredPages > currentPages) {
    wasmInstance.memory.grow(requiredPages - currentPages);
  }

  // Encode to wasm memory
  const bytesWritten = wasmInstance.utf8Encode(str, 0);

  // Copy from wasm memory to output buffer
  const wasmBytes = new Uint8Array(wasmInstance.memory.buffer, 0, bytesWritten);
  output.set(wasmBytes, outputOffset);

  return bytesWritten;
}

/**
 * Decode UTF-8 bytes to string.
 */
export function utf8DecodeWasm(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  if (wasmInstance === null) {
    throw new Error("wasm not initialized");
  }

  // Ensure wasm memory is large enough
  const requiredPages = Math.ceil(byteLength / 65536);
  const currentPages = wasmInstance.memory.buffer.byteLength / 65536;

  if (requiredPages > currentPages) {
    wasmInstance.memory.grow(requiredPages - currentPages);
  }

  // Copy bytes to wasm memory
  const wasmBytes = new Uint8Array(wasmInstance.memory.buffer, 0, byteLength);
  wasmBytes.set(bytes.subarray(inputOffset, inputOffset + byteLength));

  // Decode from wasm memory
  const result = wasmInstance.utf8Decode(0, byteLength);

  // Remove leading NUL character (artifact of wasm implementation)
  return result.length > 0 && result.charCodeAt(0) === 0 ? result.slice(1) : result;
}
