/**
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 * THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING
 * FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 * CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import { encode, decode, ExtensionCodec, DecodeError } from "@ohos/msgpack";

namespace CodecBigint {
  export function encodes_and_decodes_0n(): Object {
    let startTime1 = new Date().getTime();
    const extensionCodec = new ExtensionCodec<undefined>();
    extensionCodec.register({
      type: 0,
      encode: (input: Object) => {
        if (typeof input === "bigint") {
          if (input <= Number.MAX_SAFE_INTEGER && input >= Number.MIN_SAFE_INTEGER) {
            return encode<undefined>(Number.parseInt(input.toString(), 10));
          } else {
            return encode<undefined>(input.toString());
          }
        } else {
          return null;
        }
      },
      decode: (data: Uint8Array) => {
        const val: Object = decode<undefined>(data);
        if (!(typeof val === "string" || typeof val === "number")) {
          throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
        }
        return BigInt(val);
      },
    });
    const value = BigInt(0);
    const encoded = encode<undefined>(value, { extensionCodec });
    const decoded = decode<undefined>(encoded, { extensionCodec });
    let endTime1 = new Date().getTime();
    let averageTime1 = ((endTime1 - startTime1) * 1000) / 4;
    console.log('msgpack-javascript:encodes_and_decodes_0n averageTime =' + averageTime1)
    return decoded;
  }


  export function encodes_and_decodes_MAX_SAFE_INTEGER_1(): Object {
    const extensionCodec = new ExtensionCodec<undefined>();
    extensionCodec.register({
      type: 0,
      encode: (input: Object) => {
        if (typeof input === "bigint") {
          if (input <= Number.MAX_SAFE_INTEGER && input >= Number.MIN_SAFE_INTEGER) {
            return encode<undefined>(Number.parseInt(input.toString(), 10));
          } else {
            return encode<undefined>(input.toString());
          }
        } else {
          return null;
        }
      },
      decode: (data: Uint8Array) => {
        const val = decode<undefined>(data);
        if (!(typeof val === "string" || typeof val === "number")) {
          throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
        }
        return BigInt(val);
      },
    });
    const value = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);

    let startTime1 = new Date().getTime();

    const encoded = encode<undefined>(value, {useBigInt64: true,
      extensionCodec
    });
    const decoded = decode<undefined>(encoded, {useBigInt64: true,
      extensionCodec
    });

    let endTime1 = new Date().getTime();
    let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
    console.log('msgpack-javascript:encodes_and_decodes_MAX_SAFE_INTEGER_1 averageTime =' + averageTime1)
    return decoded;
  }

  export function encodes_and_decodes_MIN_SAFE_INTEGER_minus1(): Object {
    const extensionCodec = new ExtensionCodec<undefined>();
    extensionCodec.register({
      type: 0,
      encode: (input: Object) => {
        if (typeof input === "bigint") {
          if (input <= Number.MAX_SAFE_INTEGER && input >= Number.MIN_SAFE_INTEGER) {
            return encode<undefined>(Number.parseInt(input.toString(), 10));
          } else {
            return encode<undefined>(input.toString());
          }
        } else {
          return null;
        }
      },
      decode: (data: Uint8Array) => {
        const val = decode<undefined>(data);
        if (!(typeof val === "string" || typeof val === "number")) {
          throw new DecodeError(`unexpected BigInt source: ${val} (${typeof val})`);
        }
        return BigInt(val);
      },
    });
    const value = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1);

    let startTime1 = new Date().getTime();

    const encoded = encode<undefined>(value, {
      extensionCodec
    });
    const decoded = decode<undefined>(encoded, {
      extensionCodec
    });

    let endTime1 = new Date().getTime();
    let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
    console.log('msgpack-javascript:encodes_and_decodes_MIN_SAFE_INTEGER_minus1 averageTime =' + averageTime1)
    return decoded;
  }
}

export default CodecBigint;