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
import assert from "./assert2hypium";
import CodecBigint from "../test/stdlib/CodecBigint";

// 测试用例通过 测试框架不支持 expect cannot serialize a BigInt
export default function CodecBigintTest() {
  describe('CodecBigintTest', () => {
    // Defines a test suite. Two parameters are supported: test suite name and test suite function.
    beforeAll(() => {
      // Presets an action, which is performed only once before all test cases of the test suite start.
      // This API supports only one parameter: preset action function.
    })

    beforeEach(() => {
      // if (typeof BigInt === "undefined") {
      //   this.skip();
      // }
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
    it("encodes_and_decodes_0n", 0, () => {
      let value = BigInt(0);
      let decoded: Object = CodecBigint.encodes_and_decodes_0n()
      // 测试框架无法覆盖BitInt(0)的情况
      // assert.deepStrictEqual(decoded, value);
      assert.strictEqual(decoded, value);
    });

    it("encodes_and_decodes_MAX_SAFE_INTEGER_1", 0, () => {
      const value = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
      let decoded: Object = CodecBigint.encodes_and_decodes_MAX_SAFE_INTEGER_1()
      // assert.deepStrictEqual(decoded, value);
      assert.strictEqual(decoded, value);
    });

    it("encodes_and_decodes_MIN_SAFE_INTEGER_minus1", 0, () => {
      const value = BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1);
      let decoded: Object = CodecBigint.encodes_and_decodes_MIN_SAFE_INTEGER_minus1()
      // assert.deepStrictEqual(decoded, value);
      assert.strictEqual(decoded, value);
    });

  })
}








