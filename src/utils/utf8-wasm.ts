/**
 * WebAssembly-based UTF-8 string processing using js-string-builtins with GC arrays.
 *
 * Environment variables:
 * - MSGPACK_WASM=force: Force wasm mode, throw error if wasm fails to load
 * - MSGPACK_WASM=never: Disable wasm, always use pure JS
 *
 * This implementation uses WASM GC arrays with intoCharCodeArray/fromCharCodeArray
 * for efficient bulk string operations instead of character-by-character processing.
 *
 * When available (Node.js 24+ with --experimental-wasm-rab-integration), uses
 * resizable ArrayBuffer integration for reduced glue code and auto-tracking views.
 */

import { wasmBinary } from "./utf8-wasm-binary.ts";

function getWasmMode(): "force" | "never" | "auto" {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof process !== "undefined" && process.env) {
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

// Resizable ArrayBuffer integration (RAB)
// When available, provides auto-tracking views that don't detach on memory.grow()
let wasmResizableBuffer: ArrayBuffer | null = null;
let wasmMemoryView: Uint8Array | null = null;
let useResizableBuffer = false;

function base64ToBytes(base64: string): Uint8Array {
  // @ts-expect-error - fromBase64 is not yet supported in TypeScript
  if (Uint8Array.fromBase64) {
    // @ts-expect-error - fromBase64 is not yet supported in TypeScript
    return Uint8Array.fromBase64(base64);
  } else if (typeof Buffer !== "undefined") {
    // Node.js
    return new Uint8Array(Buffer.from(base64, "base64"));
  } else {
    // Legacy fallback
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

function tryInitializeResizableBuffer(): void {
  if (!wasmInstance) return;

  try {
    // Check if toResizableBuffer() is available (Node.js 24+ with --experimental-wasm-rab-integration)
    const memory = wasmInstance.memory as any;
    if (typeof memory.toResizableBuffer === "function") {
      wasmResizableBuffer = memory.toResizableBuffer();
      // Create auto-tracking view (no explicit length = tracks buffer size)
      wasmMemoryView = new Uint8Array(wasmResizableBuffer);
      useResizableBuffer = true;
    }
  } catch {
    // RAB integration not available, will use fallback
    useResizableBuffer = false;
  }
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

    // Try to enable resizable buffer integration for reduced glue code
    tryInitializeResizableBuffer();
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

/**
 * Whether resizable ArrayBuffer integration is available.
 * When true, uses auto-tracking views for reduced glue code.
 */
export const RAB_AVAILABLE = useResizableBuffer;

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

// Page size constant
const PAGE_SIZE = 65536;

/**
 * Ensure wasm memory is large enough.
 * With RAB integration, the view auto-tracks size changes.
 * Without RAB, we need to recreate the view after grow.
 */
function ensureMemorySize(requiredBytes: number): void {
  const requiredPages = Math.ceil(requiredBytes / PAGE_SIZE);
  const currentPages = wasmInstance!.memory.buffer.byteLength / PAGE_SIZE;

  if (requiredPages > currentPages) {
    wasmInstance!.memory.grow(requiredPages - currentPages);
    // With RAB, wasmMemoryView auto-tracks the new size
    // Without RAB, we don't maintain a persistent view
  }
}

/**
 * Get a view of wasm memory for reading/writing.
 * With RAB integration, returns the auto-tracking view.
 * Without RAB, creates a fresh view each time.
 */
function getMemoryView(): Uint8Array {
  if (useResizableBuffer) {
    // Auto-tracking view - no need to recreate
    return wasmMemoryView!;
  }
  // Fallback: create fresh view (handles detached buffer after grow)
  return new Uint8Array(wasmInstance!.memory.buffer);
}

/**
 * Encode string to UTF-8 bytes in the provided buffer.
 * Returns the number of bytes written.
 *
 * With RAB integration: uses auto-tracking view, minimal glue code.
 * Without RAB: recreates view after potential memory growth.
 */
export function utf8EncodeWasm(str: string, output: Uint8Array, outputOffset: number): number {
  // Estimate max byte length: each UTF-16 code unit produces at most 3 UTF-8 bytes
  const maxByteLength = str.length * 3;

  // Ensure memory is large enough (view auto-tracks with RAB)
  ensureMemorySize(maxByteLength);

  // Encode to wasm memory
  const bytesWritten = wasmInstance!.utf8Encode(str, 0);

  // Copy from wasm memory to output buffer
  const view = getMemoryView();
  output.set(view.subarray(0, bytesWritten), outputOffset);

  return bytesWritten;
}

/**
 * Decode UTF-8 bytes to string.
 * Uses GC arrays with fromCharCodeArray for efficient string creation.
 *
 * With RAB integration: uses auto-tracking view, minimal glue code.
 * Without RAB: recreates view after potential memory growth.
 */
export function utf8DecodeWasm(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
  // Ensure memory is large enough (view auto-tracks with RAB)
  ensureMemorySize(byteLength);

  // Copy UTF-8 bytes to wasm linear memory
  const view = getMemoryView();
  view.set(bytes.subarray(inputOffset, inputOffset + byteLength), 0);

  // Allocate GC array for UTF-16 output (max size = byteLength for ASCII)
  const arr = wasmInstance!.allocArray(byteLength);

  // Decode UTF-8 to UTF-16 in GC array
  const codeUnits = wasmInstance!.utf8DecodeToArray(byteLength, arr);

  // Create string directly from GC array using fromCharCodeArray
  return wasmInstance!.arrayToString(arr, 0, codeUnits);
}
