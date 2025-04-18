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

import { encode, decode, ExtensionCodec, decodeAsync } from "@ohos/msgpack";

namespace ExtensionCodecTest {
  export function extensionCodecTest(it: Function, expect: Function): void {
    let context: Function = (str: string, callback: Function) => {
      callback();
    }
    let deepStrictEqual: Function = (src: Object, dst: Object, info?: string) => {
      expect(src).assertDeepEquals(dst)
      if (info) {
        console.log(info)
      }
    }
    context("timestamp", () => {
      const extensionCodec = ExtensionCodec.defaultCodec;

      it("encodes_and_decodes_a_date_without_milliseconds_timestamp_32", 0, () => {
        let startTime1 = new Date().getTime();
        const date = new Date(1556633024000);
        const encoded = encode<undefined>(date, {
          extensionCodec
        });
        deepStrictEqual(
          decode<undefined>(encoded, {
            extensionCodec
          }),
          date,
          `date: ${date.toISOString()}, encoded: ${encoded}`,
        );
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_a_date_without_milliseconds_timestamp_32 averageTime = ${averageTime1}`)
      });

      it("encodes_and_decodes_a_date_with_milliseconds_timestamp_64", 0, () => {
        let startTime1 = new Date().getTime();
        const date = new Date(1556633024123);
        const encoded = encode<undefined>(date, {
          extensionCodec
        });
        deepStrictEqual(
          decode<undefined>(encoded, {
            extensionCodec
          }),
          date,
          `date: ${date.toISOString()}, encoded: ${encoded}`,
        );
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_a_date_with_milliseconds_timestamp_64 averageTime = ${averageTime1}`)
      });

      it("encodes_and_decodes_a_future_date_timestamp_96_", 0, () => {
        let startTime1 = new Date().getTime();
        const date = new Date(0x400000000 * 1000);
        const encoded = encode<undefined>(date, {
          extensionCodec
        });
        deepStrictEqual(
          decode<undefined>(encoded, {
            extensionCodec
          }),
          date,
          `date: ${date.toISOString()}, encoded: ${encoded}`,
        );
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_a_future_date_timestamp_96_ averageTime = ${averageTime1}`)
      });
    });

    context("custom extensions", () => {
      const extensionCodec = new ExtensionCodec<undefined>();

      // Set<T>
      extensionCodec.register({
        type: 0,
        encode: (object: unknown): Uint8Array | null => {
          if (object instanceof Set) {
            return encode<undefined>([...object]);
          } else {
            return null;
          }
        },
        decode: (data: Uint8Array) => {
          const array = decode<undefined>(data) as Array<unknown>;
          return new Set<unknown>(array);
        },
      });

      // Map<T>
      extensionCodec.register({
        type: 1,
        encode: (object: unknown): Uint8Array | null => {
          if (object instanceof Map) {
            return encode<undefined>([...object]);
          } else {
            return null;
          }
        },
        decode: (data: Uint8Array) => {
          const array = decode<undefined>(data) as Array<[unknown, unknown]>;
          return new Map<unknown, unknown>(array);
        },
      });

      it("encodes_and_decodes_custom_data_types_synchronously", 0, () => {
        let startTime1 = new Date().getTime();
        const set = new Set([1, 2, 3]);
        const map = new Map([
          ["foo", "bar"],
          ["bar", "baz"],
        ]);
        const encoded = encode<undefined>([set, map], {
          extensionCodec
        });
        deepStrictEqual(decode<undefined>(encoded, {
          extensionCodec
        }), [set, map]);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_custom_data_types_synchronously averageTime = ${averageTime1}`)
      });

      it("encodes_and_decodes_custom_data_types_asynchronously_", 0, async () => {
        let startTime1 = new Date().getTime();
        const set = new Set([1, 2, 3]);
        const map = new Map([
          ["foo", "bar"],
          ["bar", "baz"],
        ]);
        const encoded = encode<undefined>([set, map], {
          extensionCodec
        });
        const createStream = async function* () {
          yield encoded;
        };
        deepStrictEqual(await decodeAsync<undefined>(createStream(), {
          extensionCodec
        }), [set, map]);
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_custom_data_types_asynchronously_ averageTime = ${averageTime1}`)
      });
    });

    context("custom_extensions_with_custom_context", () => {
      class Context {
        public expectations: Array<any> = [];

        constructor(public ctxVal: number) {
        }

        public hasVisited(val: any) {
          this.expectations.push(val);
        }
      }

      const extensionCodec = new ExtensionCodec<Context>();

      class Magic<T> {
        constructor(public val: T) {
        }
      }

      // Magic
      extensionCodec.register({
        type: 0,
        encode: (object: unknown, context): Uint8Array | null => {
          if (object instanceof Magic) {
            context.hasVisited({
              encoding: object.val
            });
            return encode({
              magic: object.val, ctx: context.ctxVal
            }, {
              extensionCodec, context
            });
          } else {
            return null;
          }
        },
        decode: (data: Uint8Array, extType, context) => {
          extType;
          const decoded = decode(data, {
            extensionCodec, context
          }) as { magic: number };
          context.hasVisited({
            decoding: decoded.magic, ctx: context.ctxVal
          });
          return new Magic(decoded.magic);
        },
      });

      it("encodes_and_decodes_custom_data_types_synchronously", 0, () => {
        const context = new Context(42);
        const magic1 = new Magic(17);
        const magic2 = new Magic({
          foo: new Magic("inner")
        });
        const test = [magic1, magic2];

        let startTime1 = new Date().getTime();
        const encoded = encode(test, {
          extensionCodec, context
        });
        let decoded = decode(encoded, {
          extensionCodec, context
        });
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_custom_data_types_synchronously averageTime = ${averageTime1}`)

        deepStrictEqual(decoded, test);
        deepStrictEqual(context.expectations, [
          {
            encoding: magic1.val,
          },
          {
            encoding: magic2.val,
          },
          {
            encoding: magic2.val.foo.val,
          },
          {
            ctx: 42,
            decoding: magic1.val,
          },
          {
            ctx: 42,
            decoding: magic2.val.foo.val,
          },
          {
            ctx: 42,
            decoding: magic2.val,
          },
        ]);

      });

      it("encodes_and_decodes_custom_data_types_asynchronously_", 0, async () => {

        const context = new Context(42);
        const magic1 = new Magic(17);
        const magic2 = new Magic({
          foo: new Magic("inner")
        });
        const test = [magic1, magic2];

        let startTime1 = new Date().getTime();
        const encoded = encode(test, {
          extensionCodec, context
        });
        const createStream = async function* () {
          yield encoded;
        };
        let decoded = await decodeAsync(createStream(), {
          extensionCodec, context
        });
        let endTime1 = new Date().getTime();
        let averageTime1 = ((endTime1 - startTime1) * 1000) / 2;
        console.log(`msgpack-javascript:encodes_and_decodes_custom_data_types_asynchronously_ averageTime = ${averageTime1}`)


        deepStrictEqual(decoded, test);
        deepStrictEqual(context.expectations, [
          {
            encoding: magic1.val,
          },
          {
            encoding: magic2.val,
          },
          {
            encoding: magic2.val.foo.val,
          },
          {
            ctx: 42,
            decoding: magic1.val,
          },
          {
            ctx: 42,
            decoding: magic2.val.foo.val,
          },
          {
            ctx: 42,
            decoding: magic2.val,
          },
        ]);

      });
    });
  }

}

export default ExtensionCodecTest;