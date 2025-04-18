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


import { MsgTimestamp } from "../../../ohosTest/ets/test/test/msg/msg-timestamp";
import { encode, decode, ExtensionCodec } from "@ohos/msgpack";
import ohBuffer from '@ohos.buffer';
import Util from './Util';

@Entry
@Component
struct Index {
  @State message: Resource = $r('app.string.log')
  m1: Massage = {
    string: "Кириллица",
    msgpack: [
      [0xb2, 0xd0, 0x9a, 0xd0, 0xb8, 0xd1, 0x80, 0xd0, 0xb8, 0xd0, 0xbb, 0xd0, 0xbb, 0xd0, 0xb8, 0xd1, 0x86, 0xd0, 0xb0],
      [0xd9, 0x12, 0xd0, 0x9a, 0xd0, 0xb8, 0xd1, 0x80, 0xd0, 0xb8, 0xd0, 0xbb, 0xd0, 0xbb, 0xd0, 0xb8, 0xd1, 0x86, 0xd0, 0xb0]
    ]
  };
  m2: Massage = {
    string: "ひらがな",
    msgpack: [
      [0xac, 0xe3, 0x81, 0xb2, 0xe3, 0x82, 0x89, 0xe3, 0x81, 0x8c, 0xe3, 0x81, 0xaa],
      [0xd9, 0x0c, 0xe3, 0x81, 0xb2, 0xe3, 0x82, 0x89, 0xe3, 0x81, 0x8c, 0xe3, 0x81, 0xaa]
    ]
  };
  m3: Massage = {
    string: "한글",
    msgpack: [
      [0xa6, 0xed, 0x95, 0x9c, 0xea, 0xb8, 0x80],
      [0xd9, 0x06, 0xed, 0x95, 0x9c, 0xea, 0xb8, 0x80]
    ]
  };
  m4: Massage = {
    string: "汉字",
    msgpack: [
      [0xa6, 0xe6, 0xb1, 0x89, 0xe5, 0xad, 0x97],
      [0xd9, 0x06, 0xe6, 0xb1, 0x89, 0xe5, 0xad, 0x97]
    ]
  };
  m5: Massage = {
    string: "漢字",
    msgpack: [
      [0xa6, 0xe6, 0xbc, 0xa2, 0xe5, 0xad, 0x97],
      [0xd9, 0x06, 0xe6, 0xbc, 0xa2, 0xe5, 0xad, 0x97]
    ]
  };
  m6: Massage = {
    string: "❤",
    msgpack: [
      [0xa3, 0xe2, 0x9d, 0xa4],
      [0xd9, 0x03, 0xe2, 0x9d, 0xa4]
    ]
  };
  m7: Massage = {
    string: "🍺",
    msgpack: [
      [0xa4, 0xf0, 0x9f, 0x8d, 0xba],
      [0xd9, 0x04, 0xf0, 0x9f, 0x8d, 0xba]
    ]
  };

  build() {
    Row() {
      Column() {
        Button(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
          .onClick(() => {
            this.testSpecString();
          })
      }
      .width('100%')
    }
    .height('100%')
  }

  testSpecString() {
    // 补齐XTS中未通过用例
    let inputs = [
    this.m1,
    this.m2,
    this.m3,
    this.m4,
    this.m5,
    this.m6,
    this.m7
    ]

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      this.checkEncodeAndDecode(input.string, input.msgpack[0], input.msgpack[1])
    }

  }

  checkEncodeAndDecode(value: string, array1: number[], array2: number[]) {
    console.log("dodo 输入value=" + value);
    let extensionCodec: ExtensionCodec<undefined> = new ExtensionCodec<undefined>();
    extensionCodec.register(Util.register);
    let b1: Uint8Array = encode<undefined>(value, { extensionCodec });
    let u8 = b1;
    for (let i = 0; i < u8.length; i++) {
      console.log(`dodo 编码后buffer[${i}]=${u8[i]}`)
    }
    let encode1 = ohBuffer.from(array1);
    let encode2 = ohBuffer.from(array2);

    console.log("dodo 解码后 array1 对应 decode1=" + decode<undefined>(encode1.buffer, {
      extensionCodec
    }) + " array2 对应 decode2=" + decode<undefined>(encode2.buffer, { extensionCodec }));
  }
}

class Massage {
  string: string = "";
  msgpack: number[][] = [[0]];
}