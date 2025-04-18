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
import hilog from '@ohos.hilog';
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'

export default function encodeTest() {
  describe('encodeTest', () => {
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

    assert.context("encode_sortKeys", () => {
      it("canonicalizes_encoded_binaries", 0, () => {

        let startTime1 = new Date().getTime();
        let ba1: BA = {
          a: 1, b: 2
        }
        let ba2: BA = {
          b: 2, a: 1
        }
        assert.deepStrictEqual(encode<undefined>(ba1, {
          sortKeys: true
        }), encode<undefined>(ba2, {
          sortKeys: true
        }));

        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:canonicalizes_encoded_binaries averageTime = ${averageTime1}`)
      });
    });


    assert.context("encode_forceFloat32", () => {
      it("encodes_numbers_in_float64_wihout_forceFloat32", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(encode<undefined>(3.14), Uint8Array.from([0xcb, 0x40, 0x9, 0x1e, 0xb8, 0x51, 0xeb, 0x85, 0x1f]));
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_numbers_in_float64_wihout_forceFloat32 averageTime = ${averageTime1}`)
      });

      it("encodes_numbers_in_float32_when_forceFloat32_true", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(encode<undefined>(3.14, {
          forceFloat32: true
        }), Uint8Array.from([0xca, 0x40, 0x48, 0xf5, 0xc3]));
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_numbers_in_float32_when_forceFloat32_true averageTime = ${averageTime1}`)
      });

      it("encodes_numbers_in_float64_with_forceFloat32_false", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(
          encode<undefined>(3.14, {
            forceFloat32: false
          }),
          Uint8Array.from([0xcb, 0x40, 0x9, 0x1e, 0xb8, 0x51, 0xeb, 0x85, 0x1f]),
        );
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_numbers_in_float64_with_forceFloat32_false averageTime = ${averageTime1}`)
      });
    });

    assert.context("encode_forceFloat", () => {
      it("encodes_integers_as_integers_without_forceIntegerToFloat", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(encode<undefined>(3), Uint8Array.from([0x3]));
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_integers_as_integers_without_forceIntegerToFloat averageTime = ${averageTime1}`)
      });

      it("encodes_integers_as_floating_point_when_forceIntegerToFloat_true", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(
          encode<undefined>(3, {
            forceIntegerToFloat: true
          }),
          Uint8Array.from([0xcb, 0x40, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
        );
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_integers_as_floating_point_when_forceIntegerToFloat_true averageTime = ${averageTime1}`)
      });

      it("encodes_integers_as_float32_when_forceIntegerToFloat_true_and_forceFloat32_true", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(
          encode<undefined>(3, {
            forceIntegerToFloat: true, forceFloat32: true
          }),
          Uint8Array.from([0xca, 0x40, 0x40, 0x00, 0x00]),
        );
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_integers_as_float32_when_forceIntegerToFloat_true_and_forceFloat32_true averageTime = ${averageTime1}`)
      });

      it("encodes_integers_as_integers_when_forceIntegerToFloat_false", 0, () => {
        let startTime1 = new Date().getTime();
        assert.deepStrictEqual(encode<undefined>(3, {
          forceIntegerToFloat: false
        }), Uint8Array.from([0x3]));
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:encodes_integers_as_integers_when_forceIntegerToFloat_false averageTime = ${averageTime1}`)
      });
    });

    assert.context("encode_ignoreUndefined", () => {
      it("encodes_foo_undefined_as_is_by_default", 0, () => {
        let startTime1 = new Date().getTime();
        let fooBar1: FooBar = {
          foo: undefined, bar: 42
        }
        let fooBar2: FooBar = {
          foo: null,
          bar: 42,
        }
        assert.deepStrictEqual(decode<undefined>(encode<undefined>(fooBar1)), fooBar2);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_foo_undefined_as_is_by_default averageTime = ${averageTime1}`)
      });

      it("encodes_foo_undefined_as_is_with_ignoreUndefined_false", 0, () => {
        let startTime1 = new Date().getTime();
        let fooBar1: FooBar = {
          foo: undefined, bar: 42
        }
        let ignoreUndefined: IgnoreUndefined = {
          ignoreUndefined: false
        }
        let fooBar2: FooBar = {
          foo: null,
          bar: 42,
        }
        assert.deepStrictEqual(decode<undefined>(encode<undefined>(fooBar1, ignoreUndefined)), fooBar2);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_foo_undefined_as_is_with_ignoreUndefined_false averageTime = ${averageTime1}`)
      });

      it("encodes_foo_undefined_to_with_ignoreUndefined_true", 0, () => {
        let startTime1 = new Date().getTime();
        let bar: Bar = {
          bar: 42
        }
        let ignoreUndefined: IgnoreUndefined = {
          ignoreUndefined: true
        }
        let fooBar: FooBar = {
          foo: undefined, bar: 42
        }
        assert.deepStrictEqual(decode<undefined>(encode<undefined>(fooBar, ignoreUndefined)), bar);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_foo_undefined_as_is_with_ignoreUndefined_false averageTime = ${averageTime1}`)
      });
    });

    assert.context("encode_rrayBuffer as buffer", () => {
      it("encode_rrayBuffer_as_buffer", 0, () => {
        let startTime1 = new Date().getTime();
        const buffer = encode<undefined>([1, 2, 3]);
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteLength);
        assert.deepStrictEqual(decode<undefined>(arrayBuffer), decode<undefined>(buffer));
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 3;
        console.log(`msgpack-javascript:encode_rrayBuffer_as_buffer averageTime = ${averageTime1}`)
      })
    });

  })
}

interface BA {
  b: number,
  a: number
}

interface Bar {
  bar: number
}

interface IgnoreUndefined {
  ignoreUndefined: boolean
}

interface FooBar {
  foo: undefined | null,
  bar: number
}