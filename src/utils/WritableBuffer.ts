import { Writable } from "../Writable";

// Experimental `push(...bytes)`-able buffer
// Unfortunately, it is always slower than Array<number>.

export class WritableBuffer implements Writable<number> {
  private length = 0;
  private buffer = new Uint8Array(128);

  push(...bytes: ReadonlyArray<number>): void {
    const offset = this.length;
    const bytesLen = bytes.length;
    const newLength = offset + bytesLen;

    if (this.buffer.length < newLength) {
      this.grow(newLength);
    }

    const buffer = this.buffer;
    for (let i = 0; i < bytesLen; i++) {
      buffer[offset + i] = bytes[i];
    }
    this.length = newLength;
  }

  grow(newLength: number) {
    const newBuffer = new Uint8Array(newLength * 2);
    newBuffer.set(this.buffer);
    this.buffer = newBuffer;
  }

  toUint8Array(): Uint8Array {
    return this.buffer.subarray(0, this.length);
  }
}
