/**
 * Copyright (c) 2024 Huawei Device Co., Ltd.
 *
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL
 * WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 * THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
 * CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING
 * FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 * CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
import { encode, decode, ExtensionCodec } from '@ohos/msgpack';

@Entry
@Component
struct Encoding64DemoTwo {
  @State message: string = '';
  @State encodedMessage: string = '';
  @State decodeMessage: string = '';
  encodedUint8?: Uint8Array = undefined;

  aboutToAppear(): void {
    this.message = this.getResourceString($r('app.string.Display_encoded_data'));
    this.encodedMessage = this.getResourceString($r('app.string.Display_decoded_data'));
    this.decodeMessage = this.getResourceString($r('app.string.Display_decoded_data'));
  }

  getResourceString(res: Resource) {
    return getContext().resourceManager.getStringSync(res.id);
  }

  build() {
    Row() {
      Column() {
        Button($r('app.string.Object_encoding')).onClick(() => {
          const extensionCodec = new ExtensionCodec<undefined>();
          extensionCodec.register({
            type: 0,
            encode: (input: Object) => {
              if (typeof input === 'bigint') {
                if (input <= Number.MAX_SAFE_INTEGER && input >= Number.MIN_SAFE_INTEGER) {
                  return encode<undefined>(Number.parseInt(input.toString(), 10));
                } else {
                  return encode<undefined>(input.toString());
                }
              } else {
                return null;
              }
            },
            decode: (data: Uint8Array) => {
              const value = decode<undefined>(data) as string;
              if (!(typeof value === 'string' || typeof value === 'number')) {
              }
              return BigInt(value);
            },
          });

          this.encodedUint8 = encode<undefined>(data(), { useBigInt64: true,
            extensionCodec
          });
          this.message = this.getResourceString($r('app.string.Encoded_data')) + this.encodedUint8;
        })
        Text(this.message)
          .fontSize(25)
          .fontWeight(FontWeight.Bold)
        Button($r('app.string.decode')).onClick(() => {
          if (this.encodedUint8) {
            this.encodedMessage = this.getResourceString($r('app.string.Decoded_data')) + JSON.stringify(decode<string[]>(this.encodedUint8));
          } else {
            this.decodeMessage = this.getResourceString($r('app.string.undefined'));
          }
        })
        Text(this.encodedMessage)
          .fontSize(25)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
    }
    .height('100%')
  }
}

function data() {
  return BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
}