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
import assert from "./assert2hypium";
import { encode } from "@ohos/msgpack";
import Util from "../test/stdlib/Util";
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'

export default function decodeMultiStreamTest() {
  describe('decodeMultiStreamTest', () => {
    // Defines a test suite. Two parameters are supported: test suite name and test suite function.
    beforeAll(() => {
      // Presets an action, which is performed only once before all test cases of the test suite start.
      // This API supports only one parameter: preset action function.
    })
    beforeEach(() => {
      // Presets an action, which is performed before each unit test case starts.
      // The number of execution times is the same as the number of test cases defined by **it**.
      // This API supports only one parameter: preset action function.
    })
    afterEach(() => {
      // Presets a clear action, which is performed after each unit test case ends.
      // The number of execution times is the same as the number of test cases defined by **it**.
      // This API supports only one parameter: clear action function.
    })
    afterAll(() => {
      // Presets a clear action, which is performed after all test cases of the test suite end.
      // This API supports only one parameter: clear action function.
    })
    it("decodes_stream", 0, async () => {
      let bar: Bar = {
        name: "bar",
      }
      const items = [
        "foo",
        10,
        bar,
        [1, 2, 3],
      ];
      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      await Util.decodeMultiStreamsSetResult(await Util.decodesCreateStream(items), result)
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_stream averageTime = ${averageTime1}`)
      assert.deepStrictEqual(result, items);
    });

    it("decodes_multiple_objects_in_a_single_binary_stream", 0, async () => {
      let bar: Bar = {
        name: "bar",
      }
      const items = [
        "foo",
        10,
        bar,
        [1, 2, 3],
      ];
      const encodedItems = items.map((item) => encode<undefined>(item));
      const encoded = new Uint8Array(encodedItems.reduce((p, c) => p + c.byteLength, 0));
      let offset = 0;
      for (const encodedItem of encodedItems) {
        encoded.set(encodedItem, offset);
        offset += encodedItem.byteLength;
      }
      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      await Util.decodeMultiStreamsSetResult(await Util.Uint8ArrayCreateStreams(encoded), result)
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_multiple_objects_in_a_single_binary_stream averageTime = ${averageTime1}`)
      assert.deepStrictEqual(result, items);
    });

  })
}

interface Bar {
  name: string,
}
