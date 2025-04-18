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
import Util from "../test/stdlib/Util";
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'


export default function DecodeArrayStreamTest() {
  describe('DecodeArrayStreamTest', () => {
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
    const generateSampleObject = () => {
      let value: SampleObject = {
        id: Math.random(),
        name: "test",
      };
      return value;
    };

    it("decodes_numbers_array_array8", 0, async () => {
      const object = [1, 2, 3, 4, 5];
      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      await Util.decodeArrayStreamsSetResult(await Util.createStreams(object), result)
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_numbers_array_array8 averageTime = ${averageTime1}`)
      assert.deepStrictEqual(object, result);
    });

    it("decodes_numbers_of_array_array16", 0, async () => {
      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      await Util.decodeArrayStreamsSetResult(await Util.array16CreateStream(), result)
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_numbers_of_array_array16 averageTime = ${averageTime1}`)

      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    it("decodes_numbers_of_array_array32", 0, async () => {
      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      await Util.decodeArrayStreamsSetResult(await Util.array32CreateStream(), result)
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_numbers_of_array_array32 averageTime = ${averageTime1}`)
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    it("decodes_objects_array", 0, async () => {
      const objectsArrays: Array<Object> = [];
      for (let i = 0; i < 10; i++) {
        objectsArrays.push(generateSampleObject());
      }
      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      await Util.decodeArrayStreamsSetResult(await Util.createStreams(objectsArrays), result);
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_objects_array averageTime = ${averageTime1}`)

      assert.deepStrictEqual(objectsArrays, result);
    });

    it("fails_for_non_array_input", 0, async () => {
      const object = "demo";

      const result: Array<Object> = [];
      let startTime1 = new Date().getTime();
      try {
        await Util.decodeArrayStreamsSetResult(await Util.createStreams(object), result);
      } catch (err) {
        expect(err.message).assertContain('Unrecognized array type byte')
      } finally {
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:fails_for_non_array_input averageTime = ${averageTime1}`)
      }
    });


  })
}


interface SampleObject {
  id: number,
  name: string,
}

