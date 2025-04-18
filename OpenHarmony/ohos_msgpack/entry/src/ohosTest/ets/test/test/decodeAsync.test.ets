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
import { encode, decodeAsync } from "@ohos/msgpack";
import Util from "../test/stdlib/Util";
import { decodeAsyncObject } from "../test/stdlib/StdlibData";
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'

export default function DecodeAsyncTest() {
  describe('DecodeAsyncTest', () => {
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

    it("decodes_nil", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.nil1CreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_nil averageTime = ${averageTime1}`)

      assert.deepStrictEqual(object, null);
    });

    it("decodes_fixarray_nil", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.nil2CreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_fixarray_nil averageTime = ${averageTime1}`)

      assert.deepStrictEqual(object, [null]);
    });

    it("decodes_fixmap_foo_bar_", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.fooBarCreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_fixmap_foo_bar_ averageTime = ${averageTime1}`)
      let bar: Bar = {
        foo: "bar",
      }
      assert.deepStrictEqual(object, bar);
    });

    it("decodes_multi_byte_integer_byte_by_byte", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.byteByByte3CreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_multi_byte_integer_byte_by_byte averageTime = ${averageTime1}`)
      assert.deepStrictEqual(object, 0x1234);
    });

    it("decodes_fixstr_byte_by_byte", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.byteByByte2CreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_fixstr_byte_by_byte averageTime = ${averageTime1}`)
      assert.deepStrictEqual(object, "foo");
    });

    it("decodes_binary_byte_by_byte", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.byteByByteCreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_binary_byte_by_byte averageTime = ${averageTime1}`)
      assert.deepStrictEqual(object, Uint8Array.from([0x66, 0x6f, 0x6f]));
    });

    it("decodes_binary_with_noisy_buffer", 0, async () => {
      let startTime1 = new Date().getTime();
      const object = await Util.decodeAsyncObject(await Util.noisyBufferCreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_binary_with_noisy_buffer averageTime = ${averageTime1}`)
      assert.deepStrictEqual(object, new Uint8Array(0));
    });

    it("decodes_mixed_object_byte_by_byte", 0, async () => {
      let stream: Object =await Util.createStreams(decodeAsyncObject);
      let startTime1 = new Date().getTime();
      let result = await Util.decodeAsyncObject(stream);
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_mixed_object_byte_by_byte averageTime = ${averageTime1}`)
      assert.deepStrictEqual(result, decodeAsyncObject);
    });
    it("decodes_BufferSource", 0, async () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/BufferSource
      let startTime1 = new Date().getTime();
      // createStream() returns AsyncGenerator<ArrayLike<number> | BufferSource, ...>
      const object: Object = await Util.decodeAsyncObject(await Util.bufferSourceCreateStream());
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
      console.log(`msgpack-javascript:decodes_BufferSource averageTime = ${averageTime1}`)
      let bar: Bar = {
        foo: "bar",
      }
      assert.deepStrictEqual(object, bar);
    });

  })
}

interface Bar {
  foo: string
}

