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

import { MsgTimestamp } from "../../../ohosTest/ets/test/test/msg/msg-timestamp";
import { EXT_TIMESTAMP, encodeTimeSpecToTimestamp, decodeMulti } from "@ohos/msgpack";
import ohBuffer from '@ohos.buffer';

namespace Util {
  export let register = {
    type: EXT_TIMESTAMP,
    encode: (input) => {
      if (input instanceof MsgTimestamp) {
        return encodeTimeSpecToTimestamp({
          sec: input.getTime(),
          nsec: input.getNano(),
        });
      } else {
        return null;
      }
    },
    decode: (data: Uint8Array) => {
      return MsgTimestamp.parse(ohBuffer.from(data));
    },
  }

  export function decodeMultiSetResult(encoded: Uint8Array, result: Array<Object>): void {
    for (let item of decodeMulti(encoded)) {
      result.push(item);
    }
  }

  export function objReplacer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString();
    } else if (typeof value === 'object') {
      for (const k in value) {
        if (typeof value[k] === 'bigint') {
          value[k] = value[k].toString();
        } else if (typeof value[k] === 'object') {
          value[k] = objReplacer(k, value[k]);
        }
      }
    }
    return value;
  }
}

export default Util;