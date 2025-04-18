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

import CachedKeyDecoderTest from './test/CachedKeyDecoder.test'
import CodecBigintTest from './test/codec-bigint.test'
import CodecFloatTest from './test/codec-float.test'
import CodecIntTest from './test/codec-int.test'
import CodecTimestampTest from './test/codec-timestamp.test'
import decodeJsfuzzTest from './test/decode.jsfuzz'
import DecodeBlobTest from './test/decode-blob.test'
import DecodeMaxLengthTest from './test/decode-max-length.test'
import DecodeArrayStreamTest from './test/decodeArrayStream.test'
import DecodeAsyncTest from './test/decodeAsync.test'
import decodeMultiTest from './test/decodeMulti.test'
import decodeMultiStreamTest from './test/decodeMultiStream.test'
import denoTest from './test/deno_test'
import edgeCasesTest from './test/edge-cases.test'
import encodeTest from './test/encode.test'
import ExtensionCodecTest from './test/ExtensionCodec.test'
import readmeTest from './test/readme.test'
import msgpackTestSuiteTest from './test/msgpack-test-suite.test'
import msgpackTestSuiteTest2 from './test/msgpack-test-suite2.test'
import msgpackExtTest from './test/msgpack-ext.test'
import prototypePollutionTest from './test/prototype-pollution.test'
import reuseInstancesTest from './test/reuse-instances.test'
import Bigint64Test from './test/Bigint64.test'

export default function testsuite() {
  CachedKeyDecoderTest()
  CodecBigintTest()
  CodecFloatTest()
  CodecIntTest()
  CodecTimestampTest()
  decodeJsfuzzTest()
  DecodeBlobTest()
  DecodeMaxLengthTest()
  DecodeArrayStreamTest()
  DecodeAsyncTest()
  decodeMultiTest()
  decodeMultiStreamTest()
  denoTest()
  edgeCasesTest()
  encodeTest()
  ExtensionCodecTest()
  readmeTest()
  msgpackTestSuiteTest()
  msgpackTestSuiteTest2()
  msgpackExtTest()
  prototypePollutionTest()
  reuseInstancesTest()
  Bigint64Test()
}