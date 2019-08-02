import { utf8DecodeJs } from "./utils/utf8";

interface KeyCacheRecord {
  readonly bytes: Uint8Array;
  readonly value: string;
  hits: number;
}

const DEFAULT_MAX_KEY_LENGTH = 16;
const DEFAULT_MAX_LENGTH_PER_KEY = 32;

export class CachedKeyDecoder {
  private readonly caches: Array<Array<KeyCacheRecord>>;

  constructor(
    private readonly maxKeyLength = DEFAULT_MAX_KEY_LENGTH,
    private readonly maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY,
  ) {
    // avoid `new Array(N)` to create a non-sparse array for performance.
    this.caches = [];
    for (let i = 0; i < this.maxKeyLength; i++) {
      this.caches.push([]);
    }
  }

  public canBeCached(byteLength: number) {
    return byteLength > 0 && byteLength <= this.maxKeyLength;
  }

  private get(bytes: Uint8Array, inputOffset: number, byteLength: number): string | null {
    const records = this.caches[byteLength - 1];
    const recordsLength = records.length;

    FIND_CHUNK: for (let i = 0; i < recordsLength; i++) {
      const record = records[i];

      for (let j = 0; j < byteLength; j++) {
        if (record.bytes[j] !== bytes[inputOffset + j]) {
          continue FIND_CHUNK;
        }
      }

      record.hits++;
      return record.value;
    }
    return null;
  }

  private store(bytes: Uint8Array, value: string) {
    const records = this.caches[bytes.length - 1];
    const hits = 1;
    records.unshift({ bytes, value, hits });
    if (records.length > this.maxLengthPerKey) {
      records.pop();
    }
  }

  public decode(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
    const cachedValue = this.get(bytes, inputOffset, byteLength);
    if (cachedValue) {
      return cachedValue;
    }

    const value = utf8DecodeJs(bytes, inputOffset, byteLength);
    const byteSlice = bytes.slice(inputOffset, inputOffset + byteLength);
    this.store(byteSlice, value);
    return value;
  }
}
