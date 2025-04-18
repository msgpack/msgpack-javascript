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
import { encode,decode } from "@ohos/msgpack";
@Entry
@Component
struct EncodeDecodePage {

  @State message: string = '';
  @State message2:string = '';
  @State message3:string = '';

  encodedUint8?: Uint8Array = undefined;

  build() {
    Row() {
      Column() {
        Button($r('app.string.Object_encoding')).onClick(()=>{
          console.log("dodo click on!")
          this.encodedUint8 = encode<string>(data);
          this.message = this.getResourceString($r('app.string.Encoded_data'))+this.encodedUint8;
        })
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
        Button($r('app.string.decode')).onClick(()=>{
          if(this.encodedUint8) {
            this.message2 = this.getResourceString($r('app.string.Decoded_data'))  + JSON.stringify(decode<string[]>(this.encodedUint8));
          }else{
            this.message3 = this.getResourceString($r('app.string.undefined'));
          }
        })
        Text(this.message2)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
    }
    .height('100%')
  }
  aboutToAppear() {
    this.message = this.getResourceString($r('app.string.Display_encoded_data'));
    this.message2 = this.getResourceString($r('app.string.Display_decoded_data'));
    this.message3 = this.getResourceString($r('app.string.Display_decoded_data'));
  }

  getResourceString(res: Resource) {
    return getContext().resourceManager.getStringSync(res.id);
  }
}

class Data{
  foo: string = ""
}

let data: Data = { foo: "bar" }