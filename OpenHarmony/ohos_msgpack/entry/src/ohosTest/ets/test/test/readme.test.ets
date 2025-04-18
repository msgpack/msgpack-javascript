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
import { encode, decode } from "@ohos/msgpack";
import Util from "../test/stdlib/Util";
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'

export default function readmeTest() {
  describe('readmeTest', () => {
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

    assert.context("## Synopsis", () => {
      it("runs", 0, () => {
        let foo: Foo = {
          foo: "bar"
        }
        let object: ValueObject = {
          nil: null,
          integer: 1,
          float: Math.PI,
          string: "Hello, world!",
          binary: Uint8Array.from([1, 2, 3]),
          array: [10, 20, 30],
          map: foo,
          timestampExt: new Date(),
        };

        let startTime1 = new Date().getTime();
        const encoded = encode<undefined>(object);
        let decoded = Util.decodeObject(encoded);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:runs averageTime = ${averageTime1}`)
        // encoded is an Uint8Array instance

        assert.deepStrictEqual(decoded, object);

      });
    });
  })
}


interface Foo {
  foo: string
}

interface ValueObject {
  nil: null,
  integer: number,
  float: number,
  string: string,
  binary: Uint8Array,
  array: number[],
  map: Foo,
  timestampExt: Date,
}
