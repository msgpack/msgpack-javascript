
export function isNodeJsBuffer(object: unknown): object is Buffer {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(object);
}
