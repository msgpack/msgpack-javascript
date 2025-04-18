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

import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'
import { CachedKeyDecoder, KeyDecoder } from "@ohos/msgpack"
import { utf8Count, utf8EncodeJs } from '@ohos/msgpack'

export default function CachedKeyDecoderTest() {
  describe('CachedKeyDecoderTest', () => {
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

    it("decodes_a_string", 0, () => {
      let startTime1 = new Date().getTime();
      const decoder = new CachedKeyDecoder();
      expect(tryDecode(decoder, "foo")).assertDeepEquals("foo")
      expect(tryDecode(decoder, "foo")).assertDeepEquals("foo")
      expect(tryDecode(decoder, "foo")).assertDeepEquals("foo")
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 3;
      console.log('msgpack-javascript:decodes_a_string averageTime =' + averageTime1)
      // console.dir(decoder, { depth: 100 });
    });

    it("decodes_strings", 0, () => {
      let startTime1 = new Date().getTime();
      const decoder = new CachedKeyDecoder();
      expect(tryDecode(decoder, "foo")).assertDeepEquals("foo")
      expect(tryDecode(decoder, "bar")).assertDeepEquals("bar")
      expect(tryDecode(decoder, "foo")).assertDeepEquals("foo")
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 3;
      console.log('msgpack-javascript:decodes_strings averageTime =' + averageTime1)
      // console.dir(decoder, { depth: 100 });
    });

    it("decodes_strings_with_purging_records", 0, () => {
      let startTime1 = new Date().getTime();
      const decoder = new CachedKeyDecoder(16, 4);
      for (let i = 0; i < 100; i++) {
        expect(tryDecode(decoder, "foo1")).assertDeepEquals("foo1")
        expect(tryDecode(decoder, "foo2")).assertDeepEquals("foo2")
        expect(tryDecode(decoder, "foo3")).assertDeepEquals("foo3")
        expect(tryDecode(decoder, "foo4")).assertDeepEquals("foo4")
        expect(tryDecode(decoder, "foo5")).assertDeepEquals("foo5")
      }
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 500;
      console.log('msgpack-javascript:decodes_strings_with_purging_records averageTime =' + averageTime1)
      // console.dir(decoder, { depth: 100 });
    });


    it("decodes_str_with_len_1", 0, () => {
      let startTime1 = new Date().getTime();
      const decoder = new CachedKeyDecoder();
      expect(tryDecode(decoder, "f")).assertDeepEquals("f")
      expect(tryDecode(decoder, "a")).assertDeepEquals("a")
      expect(tryDecode(decoder, "f")).assertDeepEquals("f")
      expect(tryDecode(decoder, "a")).assertDeepEquals("a")
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 4;
      console.log('msgpack-javascript:decodes_str_with_len_1 averageTime =' + averageTime1)
      // console.dir(decoder, { depth: 100 });
    });

    it("decodes_str_with_len_maxKeyLength", 0, () => {
      let startTime1 = new Date().getTime();
      const decoder = new CachedKeyDecoder(1);
      expect(tryDecode(decoder, "f")).assertDeepEquals("f")
      expect(tryDecode(decoder, "a")).assertDeepEquals("a")
      expect(tryDecode(decoder, "f")).assertDeepEquals("f")
      expect(tryDecode(decoder, "a")).assertDeepEquals("a")
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 4;
      console.log('msgpack-javascript:decodes_str_with_len_maxKeyLength averageTime =' + averageTime1)

      //console.dir(decoder, { depth: 100 });
    });
  })
}

function tryDecode(keyDecoder: KeyDecoder, str: string): string {
  const byteLength = utf8Count(str);
  const bytes = new Uint8Array(byteLength);
  utf8EncodeJs(str, bytes, 0);
  if (!keyDecoder.canBeCached(byteLength)) {
    throw new Error("Unexpected precondition");
  }
  return keyDecoder.decode(bytes, 0, byteLength);
}
