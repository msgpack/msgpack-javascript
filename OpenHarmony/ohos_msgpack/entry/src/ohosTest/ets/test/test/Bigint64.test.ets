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
import assert from './assert2hypium';
import { encode, decode } from '@ohos/msgpack';
import { describe, it, TestType } from '@ohos/hypium';
import Util from 'ets/pages/Util';

export default function Bigint64Test() {
  const BASE_COUNT: number = 2000;

  describe('Bigint64Test', () => {

    it('encodes_and_decodes_0n', TestType.PERFORMANCE, () => {
      let startTime1 = new Date().getTime();
      for (let index = 0; index < BASE_COUNT; index++) {
        const value = JSON.stringify(Number(BigInt(1)));
        const encoded = encode(value, {
          useBigInt64: true
        });
        assert.deepStrictEqual(decode(encoded, {
          useBigInt64: true
        }), value)
      }
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / BASE_COUNT;
      console.log('encodes_and_decodes_0n' + averageTime1)
    });

    it('encodes_and_decodes_MAX_SAFE_INTEGER_add_1', TestType.PERFORMANCE, () => {
      let startTime1 = new Date().getTime();
      for (let index = 0; index < BASE_COUNT; index++) {
        const value = JSON.stringify(Number(BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)));
        const encoded = encode(value, {
          useBigInt64: true
        });
        assert.deepStrictEqual(decode(encoded, {
          useBigInt64: true
        }), value)
      }
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / BASE_COUNT;
      console.log('encodes_and_decodes_MAX_SAFE_INTEGER_add_1' + averageTime1)
    });

    it('encodes_and_decodes_MAX_SAFE_INTEGER_del_1', TestType.PERFORMANCE, () => {
      let startTime1 = new Date().getTime();
      for (let index = 0; index < BASE_COUNT; index++) {
        const value = JSON.stringify(Number(BigInt(Number.MAX_SAFE_INTEGER) - BigInt(1)));
        const encoded = encode(value, {
          useBigInt64: true
        });
        assert.deepStrictEqual(decode(encoded, {
          useBigInt64: true
        }), value)
      }
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / BASE_COUNT;
      console.log('encodes_and_decodes_MAX_SAFE_INTEGER_del_1' + averageTime1)
    });

    it('encodes_and_decodes_values_with_numbers_and_bigint', TestType.PERFORMANCE, () => {
      let startTime1 = new Date().getTime();
      const value: ESObject = {
        ints: [0, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
        nums: [Number.NaN, Math.PI, Math.E, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
        bigints: [BigInt(0), BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1), BigInt(Number.MIN_SAFE_INTEGER) - BigInt(1)],
      };
      let json = JSON.stringify(value, Util.objReplacer)
      for (let index = 0; index < BASE_COUNT; index++) {
        const encoded = encode(JSON.parse(json), {
          useBigInt64: true
        });
        assert.notDeepStrictEqual(decode(encoded, {
          useBigInt64: true
        }), value);
      }
      let endTime1 = new Date().getTime();
      let averageTime1 = ((endTime1 - startTime1) * 1000) / BASE_COUNT;
      console.log('encodes_and_decodes_values_with_numbers_and_bigint' + averageTime1)
    });
  })
}