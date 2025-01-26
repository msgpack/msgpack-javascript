function isArrayBuffer(buffer: unknown): buffer is ArrayBuffer | SharedArrayBuffer {
  return (
    buffer instanceof ArrayBuffer || (typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer)
  );
}

export function ensureUint8Array(
  buffer: ArrayLike<number> | Uint8Array<ArrayBufferLike> | ArrayBufferView | ArrayBufferLike,
): Uint8Array<ArrayBufferLike> {
  if (buffer instanceof Uint8Array) {
    return buffer;
  } else if (ArrayBuffer.isView(buffer)) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else if (isArrayBuffer(buffer)) {
    return new Uint8Array(buffer);
  } else {
    // ArrayLike<number>
    return Uint8Array.from(buffer);
  }
}

export function createDataView(buffer: ArrayLike<number> | ArrayBufferView | ArrayBuffer): DataView<ArrayBufferLike> {
  if (buffer instanceof ArrayBuffer) {
    return new DataView(buffer);
  }

  const bufferView = ensureUint8Array(buffer);
  return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}
