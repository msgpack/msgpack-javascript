
export function isObject(object: unknown): object is Record<string, unknown> {
  return typeof object === "object" && object !== null;
}

export function isNodeJsBuffer(object: unknown): object is Buffer {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(object);
}
