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
import router from '@ohos.router';

@Entry
@Component
struct Index {
  build() {
    Row() {
      Column() {
        Button($r('app.string.Simple_encoding_and_decoding'))
          .onClick(() => {
            router.pushUrl({ url: 'pages/EncodeDecodePage' })
          })
        Button('Encoding64DemoOne')
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/Encoding64DemoOne' })
          })
        Button('Encoding64DemoTwo')
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/Encoding64DemoTwo' })
          })
        Button('Encoding64DemoThree')
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/Encoding64DemoThree' })
          })
        Button('Encoding64DemoFour')
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/Encoding64DemoFour' })
          })
        Button($r('app.string.Constructor_encoding_and_decoding'))
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/EncodeDecodeConstructorPage' })
          })
        Button($r('app.string.Complex_encoding_decoding'))
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/MultiDecodePage' })
          })
        Button($r('app.string.Special_Character'))
          .margin({ top: 10 })
          .onClick(() => {
            router.pushUrl({ url: 'pages/ExamPage' })
          })
      }
      .width('100%')
    }
    .height('100%')
  }
}
