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
import { setInt64, getInt64, getUint64, setUint64 } from "@ohos/msgpack";
import hilog from '@ohos.hilog';
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'
import { INT64SPECS } from './stdlib/StdlibData';


export default function CodecIntTest() {
  describe('CodecIntTest', () => {
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


    assert.context("int_64", () => {
      for (const name of Object.keys(INT64SPECS)) {
        const value = INT64SPECS[name]!;

        it(`sets_and_gets_${value}_${value < 0 ? "-" : ""}0x${Math.abs(value).toString(16)}_`,0, () => {
          let startTime1 = new Date().getTime();
          const b = new Uint8Array(8);
          const view = new DataView(b.buffer);
          setInt64(view, 0, value);
          assert.deepStrictEqual(getInt64(view, 0), value);
          let endTime1 = new Date().getTime();
          let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
          console.log(`msgpack-javascript:sets_and_gets_${value}_${value < 0 ? "-" : ""}0x${Math.abs(value).toString(16)}_ averageTime = ${averageTime1}`)
        });
      }
    });

    assert.context("uint_64", () => {
      it(`sets_and_gets_0`,0, () => {
        let startTime1 = new Date().getTime();
        const b = new Uint8Array(8);
        const view = new DataView(b.buffer);
        setUint64(view, 0, 0);
        assert.deepStrictEqual(getUint64(view, 0), 0);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:sets_and_gets_0 averageTime = ${averageTime1}`)
      });

      it(`sets_and_gets_MAX_SAFE_INTEGER`,0, () => {
        let startTime1 = new Date().getTime();
        const b = new Uint8Array(8);
        const view = new DataView(b.buffer);
        setUint64(view, 0, Number.MAX_SAFE_INTEGER);
        assert.deepStrictEqual(getUint64(view, 0), Number.MAX_SAFE_INTEGER);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:sets_and_gets_MAX_SAFE_INTEGER averageTime = ${averageTime1}`)
      });
    });

  })
}


