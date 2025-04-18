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
import { encode } from "@ohos/msgpack";
import Util from './Util';

@Entry
@Component
struct MultiDecodePage {
  @State message: string = '';
  @State message2: string = '';
  encodedUint8: Uint8Array | undefined = undefined;

  aboutToAppear(): void {
    this.message = this.getResourceString($r('app.string.Display_original_data'));
    this.message2 = this.getResourceString($r('app.string.Data_display_after_decodeMulti_decoding'));
  }

  getResourceString(res: Resource) {
    return getContext().resourceManager.getStringSync(res.id);
  }

  build() {
    Row() {
      Column() {
        Button($r('app.string.Object_Display')).onClick(() => {
          console.log('dodo click on!')
          let bar: Bar = {
            name: "bar",
          }
          this.message = JSON.stringify([
            "foo",
            10,
            bar,
            [1, 2, 3],
          ])
        })
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        Button($r("app.string.MultiDecoder")).onClick(() => {
          let bar: Bar = {
            name: "bar",
          }
          let items = [
            "foo",
            10,
            bar,
            [1, 2, 3],
          ]
          let encodedItems: Uint8Array[]  = items.map((item): Uint8Array => encode<undefined>(item));
          let encoded = new Uint8Array(encodedItems.reduce((p: number, c: Uint8Array) => p + c.byteLength, 0));
          let offset = 0;
          for (let encodedItem of encodedItems) {
            encoded.set(encodedItem, offset);
            offset += encodedItem.byteLength;
          }
          let result: Array<Object> = [];
          Util.decodeMultiSetResult(encoded, result)
          let retStr1 = JSON.stringify(result);
          this.message2 = retStr1;
        })
        Text(this.message2)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
    }
    .height('100%')
  }
}

interface Bar {
  name: string;
}