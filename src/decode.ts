import { ExtensionCodecType } from "./ExtensionCodec";
import { Decoder, State } from "./Decoder";
import { utf8DecodeJs } from "./utils/utf8";

export type DecodeOptions = Partial<
  Readonly<{
    extensionCodec: ExtensionCodecType;

    /**
     * Maximum string length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxStrLength: number;
    /**
     * Maximum binary length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxBinLength: number;
    /**
     * Maximum array length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxArrayLength: number;
    /**
     * Maximum map length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxMapLength: number;
    /**
     * Maximum extension length.
     * Default to 4_294_967_295 (UINT32_MAX).
     */
    maxExtLength: number;
  }>
>;

export const defaultDecodeOptions: DecodeOptions = {};

interface KeyCacheRecord {
  readonly bytes: Uint8Array;
  readonly key: string;
  hits: number;
}

class CachedKeyDecoder {
  private caches: Array<Array<KeyCacheRecord>>;

  constructor(private maxKeyLength: number = 32) {
    this.caches = new Array<Array<KeyCacheRecord>>(this.maxKeyLength + 1);
  }

  public get(bytes: Uint8Array, inputOffset: number, byteLength: number): string | null {
    const chunks = this.caches[byteLength];

    if (chunks) {
      return this.findKey(bytes, inputOffset, byteLength, chunks);
    } else {
      return null;
    }
  }

  private findKey(
    bytes: Uint8Array,
    inputOffset: number,
    byteLength: number,
    chunks: Array<KeyCacheRecord>,
  ): string | null {
    let prevHits = 0;
    const chunksLength = chunks.length;
    const halfLength = byteLength / 2;
    const endPosition = inputOffset + byteLength;
    FIND_CHUNK: for (let i = 0; i < chunksLength; i++) {
      const chunk = chunks[i];

      if (i > 0 && prevHits < chunk.hits) {
        // Sort chunks by number of hits
        // in order to improve search speed for most used keys
        const prevChunk = chunks[i - 1];
        chunks[i] = prevChunk;
        chunks[i - 1] = chunk;
        prevHits = prevChunk.hits;
      } else {
        prevHits = chunk.hits;
      }

      for (let j = 0; j < halfLength; j++) {
        if (chunk.bytes[j] !== bytes[inputOffset + j]) {
          continue FIND_CHUNK;
        }

        if (chunk.bytes[byteLength - j - 1] !== bytes[endPosition - j - 1]) {
          continue FIND_CHUNK;
        }
      }

      chunk.hits++;

      return chunk.key;
    }

    return null;
  }

  public cache(bytes: Uint8Array, value: string) {
    let chunks: Array<KeyCacheRecord> = this.caches[bytes.length];

    if (!chunks) {
      chunks = [];
      this.caches[bytes.length] = chunks;
    }

    chunks.push({
      bytes: bytes,
      key: value,
      hits: 1,
    });
  }

  public decode(bytes: Uint8Array, inputOffset: number, byteLength: number): string {
    let value = this.get(bytes, inputOffset, byteLength);

    if (!value) {
      value = utf8DecodeJs(bytes, inputOffset, byteLength);
      const stringsBytes = bytes.slice(inputOffset, inputOffset + byteLength);
      this.cache(stringsBytes, value);
    }

    return value;
  }
}

class CustomDecoder extends Decoder {
  private maxCachedKeyLength = 32;
  public cachedKeyDecoder = new CachedKeyDecoder(this.maxCachedKeyLength);

  public decodeUtf8String(byteLength: number, headerOffset: number): string {
    let isKey = false;
    const canBeDecodedAsKey = byteLength > 0 && byteLength < this.maxCachedKeyLength;

    if (canBeDecodedAsKey && this.stack.length > 0) {
      const state = this.stack[this.stack.length - 1];

      isKey = state.type === State.MAP_KEY;
    }

    if (isKey && canBeDecodedAsKey) {
      const offset = this.pos + headerOffset;
      const value = this.cachedKeyDecoder.decode(this.bytes, offset, byteLength);
      this.pos += headerOffset + byteLength;
      return value;
    } else {
      return super.decodeUtf8String(byteLength, headerOffset);
    }
  }
}

const decoder = new CustomDecoder(
  defaultDecodeOptions.extensionCodec,
  defaultDecodeOptions.maxStrLength,
  defaultDecodeOptions.maxBinLength,
  defaultDecodeOptions.maxArrayLength,
  defaultDecodeOptions.maxMapLength,
  defaultDecodeOptions.maxExtLength,
);

export function decode(buffer: ArrayLike<number>, options: DecodeOptions = defaultDecodeOptions): unknown {
  decoder.setBuffer(buffer); // decodeSync() requires only one buffer
  return decoder.decodeOneSync();
}
