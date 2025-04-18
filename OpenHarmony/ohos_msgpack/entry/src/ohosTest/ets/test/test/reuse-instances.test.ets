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
import { Encoder, Decoder, decode } from "@ohos/msgpack";
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'
import { data1, data2, reuseobject } from "./stdlib/StdlibData"
import ReuseInstances from "../test/stdlib/ReuseInstances";

export default function reuseInstancesTest() {
  describe('reuseInstancesTest', () => {
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

    const N = 10;
    assert.context("encode() and decodeSync()", () => {
      it("runs_multiple_times1", 0, () => {
        for (let i = 0; i < N; i++) {
          let startTime1 = new Date().getTime();
          let endTime1 = new Date().getTime();
          let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
          console.log(`msgpack-javascript:runs_multiple_times#${i} averageTime = ${averageTime1}`)
          assert.deepStrictEqual(ReuseInstances.runsMultipleTimes1(), reuseobject, `#${i}`);
        }
      });
    });

    assert.context("encode() and decodeAsync()", () => {
      it("runs_multiple_times2", 0, async () => {
        for (let i = 0; i < N; i++) {
          let startTime1 = new Date().getTime();
          let endTime1 = new Date().getTime();
          let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
          console.log(`msgpack-javascript:runs_multiple_times#${i} averageTime = ${averageTime1}`)
          assert.deepStrictEqual(await ReuseInstances.runsMultipleTimes2(), reuseobject, `#${i}`);
        }
      });
    });

    assert.context("encode() and decodeStream()", () => {
      it("runs_multiple_times3", 0, async () => {
        for (let i = 0; i < N; i++) {
          const a: Array<Object> = [];
          await ReuseInstances.runsMultipleTimes3Or4(a,3)
          let startTime1 = new Date().getTime();
          let endTime1 = new Date().getTime();
          let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
          console.log(`msgpack-javascript:runs_multiple_times#${i} averageTime = ${averageTime1}`)
          assert.deepStrictEqual(a, [reuseobject], `#${i}`);

        }
      });
    });

    assert.context("encode() and decodeArrayStream()", () => {
      it("runs_multiple_times4", 0, async () => {
        for (let i = 0; i < N; i++) {
          const a: Array<Object> = [];
          await ReuseInstances.runsMultipleTimes3Or4(a, 4)
          let startTime1 = new Date().getTime();
          let endTime1 = new Date().getTime();
          let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
          console.log(`msgpack-javascript:runs_multiple_times#${i} averageTime = ${averageTime1}`)
          assert.deepStrictEqual(a, [[reuseobject]], `#${i}`);
        }
      });

      assert.context("regression #212", () => {
        it("runs_multiple_times5", 0, () => {
          const encoder = new Encoder<undefined>();
          const decoder = new Decoder<undefined>();

          const arr = [data1, data2];
          const enc = arr.map<Array<Object>>((x) => [x, encoder.encode(x)]);

          enc.forEach((pair) => {
            let orig = pair[0]
            let acc = pair[1]
            let startTime1 = new Date().getTime();


            let endTime1 = new Date().getTime();
            let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
            console.log(`msgpack-javascript:regression #212 runs_multiple_times#${orig} #${acc} averageTime = ${averageTime1}`)

            assert.deepStrictEqual(decoder.decode(acc as ESObject), orig);

          });
        });
      });

      assert.context("Encoder#encodeSharedRef()", () => {
        it("returns_the_shared_reference", 0, () => {
          const encoder = new Encoder<undefined>();
          let startTime1 = new Date().getTime();
          const a = encoder.encodeSharedRef(true);
          const b = encoder.encodeSharedRef(false);
          let endTime1 = new Date().getTime();
          let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
          console.log(`msgpack-javascript:returns_the_shared_reference averageTime = ${averageTime1}`)

          assert.deepStrictEqual(decode<undefined>(a), decode<undefined>(b)); // yes, this is the expected behavior
          assert.deepStrictEqual(a.buffer, b.buffer);
        });
      });
    });
  })


}






