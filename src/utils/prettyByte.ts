export function prettyByte(byte: number): string {
  return `0x${byte.toString(16).padStart(2, "0")}`;
}
