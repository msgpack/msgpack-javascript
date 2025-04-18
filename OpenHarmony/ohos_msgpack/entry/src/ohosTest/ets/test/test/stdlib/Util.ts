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

import { encode, decode, decodeAsync, decodeArrayStream, decodeMultiStream, decodeMulti } from "@ohos/msgpack";

type BufferSource = ArrayBufferView | ArrayBuffer;

namespace Util {

  export function decodeObject(object: Object): Object {
    return decode<undefined>(object as any);
  }

  export async function decodeAsyncObject(object: Object): Promise<Object> {
    return await decodeAsync<undefined>(object as any)
  }

  export async function decodeArrayStreamsSetResult(stream: Object, result: Array<Object>): Promise<void> {
    for await (const item of decodeArrayStream(stream as any)) {
      result.push(item);
    }
  }

  export async function decodeMultiStreamsSetResult(stream: Object, result: Array<Object>): Promise<void> {
    for await (const item of decodeMultiStream<undefined>(stream as any)) {
      result.push(item);
    }
  }

  export function decodeMultiSetResult(stream: Object, result: Array<Object>): void {
    for (const item of decodeMulti<undefined>(stream as any)) {
      result.push(item);
    }
  }

  export async function* createStreams(object: Object): Object {
    for (const byte of encode<undefined>(object)) {
      yield [byte];
    }
  }

  export async function* decodesCreateStream(items: Array<Object>): AsyncGenerator<Uint8Array> {
    for (const item of items) {
      yield encode<undefined>(item);
    }
  }

  export async function* Uint8ArrayCreateStreams(array: Uint8Array): AsyncGenerator<Uint8Array> {
    yield array;
  }

  export async function* decodeMultiCreateStream() {
    yield [];
  }

  export async function* throwsErrorsCreateStream() {
    yield [0x81]; // fixmap size=1
    yield encode<undefined>(null);
    yield encode<undefined>(null);
  }

  export async function* asynchronous1CreateStream() {
    yield [0x92]; // fixarray size=2
    yield encode<undefined>(null);
  }

  export async function* asynchronous2CreateStream() {
    yield [0x90]; // fixarray size=0
    yield encode<undefined>(null);
  }
  ;

  export async function* asynchronous3CreateStream() {
    yield [0x90, ...encode<undefined>(null)]; // fixarray size=0 + nil
  }

  export async function* bufferSourceCreateStream() {
    yield [0x81] as ArrayLike<number>; // fixmap size=1
    yield encode<undefined>("foo") as BufferSource;
    yield encode<undefined>("bar") as BufferSource;
  }

  function wrapWithNoisyBuffer(byte: number) {
    return Uint8Array.from([0x01, byte, 0x02]).subarray(1, 2);
  }

  export async function* noisyBufferCreateStream(): Object {
    yield wrapWithNoisyBuffer(0xc5); // bin 16
    yield [0x00];
    yield [0x00]; // bin size=0
  }

  export async function* byteByByteCreateStream(): Object {
    yield [0xc4]; // bin 8
    yield [0x03]; // bin size=3
    yield [0x66]; // "f"
    yield [0x6f]; // "o"
    yield [0x6f]; // "o"
  }

  export async function* byteByByte2CreateStream(): Object {
    yield [0xa3]; // fixstr size=3
    yield [0x66]; // "f"
    yield [0x6f]; // "o"
    yield [0x6f]; // "o"
  }

  export async function* byteByByte3CreateStream(): Object {
    yield [0xcd]; // uint 16
    yield [0x12];
    yield [0x34];
  }

  export async function* fooBarCreateStream(): Object {
    yield [0x81]; // fixmap size=1
    yield encode<undefined>("foo");
    yield encode<undefined>("bar");
  }

  export async function* nil1CreateStream(): Object {
    yield wrapWithNoisyBuffer(0xc0); // nil
  }

  export async function* nil2CreateStream(): Object {
    yield wrapWithNoisyBuffer(0x91); // fixarray size=1
    yield [0xc0]; // nil
  }

  export async function* array16CreateStream(): Object {
    yield [0xdc, 0, 3];
    yield encode<undefined>(1);
    yield encode<undefined>(2);
    yield encode<undefined>(3);
  }

  export async function* array32CreateStream(): Object {
    yield [0xdd, 0, 0, 0, 3];
    yield encode<undefined>(1);
    yield encode<undefined>(2);
    yield encode<undefined>(3);
  }

  export function expandDecodeMulti(): Object {
    return [...decodeMulti<undefined>([])];
  }
}

export default Util;