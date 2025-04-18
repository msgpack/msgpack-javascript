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

import { expect } from '@ohos/hypium'


namespace assert {
  export let strictEqual: Function = (src: Object, dst: Object, info?: string) => {
    expect(src).assertEqual(dst)
    if (info) {
      console.log(info)
    }
  }

  export let deepStrictEqual: Function = (src: Object, dst: Object, info?: string) => {
    expect(src).assertDeepEquals(dst)
    if (info) {
      console.log(info)
    }
  }

  export let notDeepStrictEqual: Function = (src: Object, dst: Object, info?: string) => {
    expect(src).not().assertDeepEquals(dst)
    if (info) {
      console.log(info)
    }
  }

  export let context: Function = (str: string, callback: Function) => {
    callback();
  }

  export let throws: Function = (srcCallback: Function, dstInfo: Object) => {
    try {
      srcCallback();
      // 如果不报错就是用例失败
      expect(false).assertTrue()
    } catch (err) {
      // 报错
      expect(true).assertTrue()
      console.log("err.msg=" + err.message)
      console.log("dstInfo=" + dstInfo)
    }
  }
}

export default assert;