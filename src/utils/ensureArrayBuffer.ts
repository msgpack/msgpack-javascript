import { isNodeJsBuffer } from "./is";

export function ensureArrayBuffer(buffer: ArrayLike<number> | ArrayBufferView | ArrayBuffer): ArrayBuffer {
  if (buffer instanceof ArrayBuffer) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer) && !isNodeJsBuffer(buffer)) {
    return buffer.buffer;
  } else {
    return Uint8Array.from(buffer).buffer;
  }
}
