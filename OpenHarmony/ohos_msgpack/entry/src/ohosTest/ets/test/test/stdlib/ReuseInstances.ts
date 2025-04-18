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

import { Encoder, Decoder } from "@ohos/msgpack";
import { reuseobject } from "./StdlibData"

namespace ReuseInstances {
  const createStream = async function* (...args: any) {
    for (const item of args) {
      yield item;
    }
  };

  export function runsMultipleTimes1(): Object {
    let encoder = new Encoder<undefined>();
    let decoder = new Decoder<undefined>();
    let encoded: Uint8Array = encoder.encode(reuseobject);
    return decoder.decode(encoded);
  }

  export async function runsMultipleTimes2(): Promise<Object> {
    let encoder = new Encoder<undefined>();
    let decoder = new Decoder<undefined>();
    let encoded: Uint8Array = encoder.encode(reuseobject);
    return await decoder.decodeAsync(createStream(encoded));
  }

  export async function runsMultipleTimes3Or4(result: Array<Object>, index: number): Promise<void> {
    let encoder = new Encoder<undefined>();
    let decoder = new Decoder<undefined>();
    let encoded: Uint8Array;
    if (index === 4) {
      encoded = encoder.encode([reuseobject]);
    } else if (index === 3) {
      encoded = encoder.encode(reuseobject);
    }
    for await (const item of decoder.decodeStream(createStream(encoded))) {
      result.push(item);
    }
  }

}

export default ReuseInstances;