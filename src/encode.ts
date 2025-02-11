import { Encoder } from "./Encoder.ts";
import type { EncoderOptions } from "./Encoder.ts";
import type { SplitUndefined } from "./context.ts";

/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
export function encode<ContextType = undefined>(
  value: unknown,
  options?: EncoderOptions<SplitUndefined<ContextType>>,
): Uint8Array {
  const encoder = new Encoder(options);
  return encoder.encodeSharedRef(value);
}
