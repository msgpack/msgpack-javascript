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
// kind of hand-written fuzzing data
// any errors should not break Encoder/Decoder instance states

import { encode, decodeAsync, decode, Encoder, Decoder, decodeMulti, decodeMultiStream } from "@ohos/msgpack";
import { DataViewIndexOutOfBoundsError } from "@ohos/msgpack";
import Util from "../test/stdlib/Util";

import assert from "./assert2hypium";

import hilog from '@ohos.hilog';
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from '@ohos/hypium'

export default function edgeCasesTest() {
  describe('edgeCasesTest', () => {
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

    assert.context("try to encode cyclic refs", () => {
      it("throws_errors_on_arrays", 0, () => {
        const encoder = new Encoder<undefined>();
        const cyclicRefs: Array<Object> = [];
        cyclicRefs.push(cyclicRefs);
        let regex: RegExp = new RegExp('too deep', 'i')
        assert.throws(() => {
          encoder.encode(cyclicRefs);
        }, regex);
        testEncoder(encoder);
      });

      it("throws_errors_on_objects", 0, () => {
        const encoder = new Encoder<undefined>();
        const cyclicRefs: Record<string, Object> = {};
        cyclicRefs["foo"] = cyclicRefs;
        let regex: RegExp = new RegExp('too deep', 'i')
        assert.throws(() => {
          encoder.encode(cyclicRefs);
        }, regex);
        testEncoder(encoder);
      });
    });

    assert.context("try_to_encode_unrecognized_objects", () => {
      it("throws_errors", 0, () => {
        const encoder = new Encoder<undefined>();
        let regex: RegExp = new RegExp('unrecognized object', 'i')
        assert.throws(() => {
          encode<undefined>(() => {
          });
        }, regex);
        testEncoder(encoder);
      });
    });

    assert.context("try_to_decode_a_map_with_non_string_keys_asynchronous", () => {
      it("throws_errors", 0, async () => {
        const decoder = new Decoder<undefined>();
        try {
          await decoder.decodeAsync(await Util.throwsErrorsCreateStream());
        } catch (err) {
        }
        // await assert.rejects(async () => {
        //   await decoder.decodeAsync(createStream());
        // }, /The type of key must be string/i);
        testDecoder(decoder);
      });
    });

    assert.context("try to decode invalid MessagePack binary", () => {
      it("throws_errors", 0, () => {
        const decoder = new Decoder<undefined>();
        const TYPE_NEVER_USED = 0xc1;
        let regex: RegExp = new RegExp('unrecognized type byte', 'i')
        assert.throws(() => {
          decoder.decode([TYPE_NEVER_USED]);
        }, regex);
        testDecoder(decoder);
      });
    });

    assert.context("try to decode insufficient data", () => {
      it("throws_errors_synchronous1", 0, () => {
        const decoder = new Decoder<undefined>();
        assert.throws(() => {
          decoder.decode([
            0x92, // fixarray size=2
            0xc0,// nil
          ]);
          // [IE11] A raw error thrown by DataView
        }, DataViewIndexOutOfBoundsError);
        testDecoder(decoder);
      });

      it("throws_errors_asynchronous1", 0, async () => {
        const decoder = new Decoder<undefined>();
        try {
          await decoder.decodeAsync(await Util.asynchronous1CreateStream());
        } catch (err) {

        }

        // await assert.rejects(async () => {
        //   await decoder.decodeAsync(createStream());
        // }, RangeError);
        testDecoder(decoder);
      });
    });

    assert.context("try to decode data with extra bytes", () => {
      it("throws_errors_synchronous2", 0, () => {
        const decoder = new Decoder<undefined>();
        assert.throws(() => {
          decoder.decode([
            0x90, // fixarray size=0
            ...encode<undefined>(null),
          ]);
        }, RangeError);
        testDecoder(decoder);
      });

      it("throws_errors_asynchronous2", 0, async () => {
        const decoder = new Decoder<undefined>();
        try {
          await decoder.decodeAsync(await Util.asynchronous2CreateStream());
        } catch (err) {

        }
        // await assert.rejects(async () => {
        //   await decoder.decodeAsync(createStream());
        // }, RangeError);
        testDecoder(decoder);
      });

      it("throws_errors_asynchronous3", 0, async () => {
        const decoder = new Decoder<undefined>();
        try {
          await decoder.decodeAsync(await Util.asynchronous3CreateStream());
        } catch (err) {
        }
        // await assert.rejects(async () => {
        //   await decoder.decodeAsync(createStream());
        // }, RangeError);
        testDecoder(decoder);
      });
    });

    assert.context("try to decode an empty input", () => {
      it("throws_RangeError_synchronous", 0, () => {
        assert.throws(() => {
          decode<undefined>([]);
        }, RangeError);
      });

      it("decodes_an_empty_array_with_decodeMulti", 0, () => {
        assert.deepStrictEqual(Util.expandDecodeMulti(), []);
      });

      it("throws_RangeError_asynchronous", 0, async () => {
        try {
          await decodeAsync<undefined>(await Util.decodeMultiCreateStream());
        } catch (err) {
          expect(err.message).assertContain("Insufficient")
        }
        // assert.rejects(async () => {
        //   await decodeAsync(createStream());
        // }, RangeError);
      });

      it("decodes_an_empty_array_with_decodeMultiStream", 0, async () => {
        const results: Array<Object> = [];
        let startTime1 = new Date().getTime();
        await Util.decodeMultiStreamsSetResult(await Util.decodeMultiCreateStream(), results)
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 1;
        console.log(`msgpack-javascript:decodes_an_empty_array_with_decodeMultiStream averageTime = ${averageTime1}`)
        assert.deepStrictEqual(results, []);
      });
    });
  })
}

interface FooBarBaz {
  foo: number,
  bar: number,
  baz: string[],
}

let testEncoder: Function = (encoder: Encoder): void => {
  const object: FooBarBaz = {
    foo: 1,
    bar: 2,
    baz: ["one", "two", "three"],
  };
  assert.deepStrictEqual(decode<undefined>(encoder.encode(object)), object);
}

let testDecoder: Function = (decoder: Decoder): void => {
  const object: FooBarBaz = {
    foo: 1,
    bar: 2,
    baz: ["one", "two", "three"],
  };
  assert.deepStrictEqual(decoder.decode(encode<undefined>(object)), object);
}
