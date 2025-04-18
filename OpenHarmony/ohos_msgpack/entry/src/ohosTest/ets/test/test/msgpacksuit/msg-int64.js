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
// msg-int64.js

import {Uint64BE,Int64BE} from "../msg/int64-buffer";

export {MsgUInt64,MsgInt64}


inherits(MsgUInt64, Uint64BE, 0xcf);
inherits(MsgInt64, Int64BE, 0xd3);

MsgUInt64.isUint64BE = Uint64BE.isUint64BE;
MsgInt64.isInt64BE = Int64BE.isInt64BE;

function MsgUInt64() {
  var that = (this instanceof MsgUInt64) ? this : new MsgUInt64();
  Uint64BE.apply(that, arguments);
  return that;
}

function MsgInt64() {
  var that = (this instanceof MsgInt64) ? this : new MsgInt64();
  Int64BE.apply(that, arguments);
  return that;
}

function inherits(child, _super, token) {
  var P = child.prototype = Object.create(_super.prototype);

  P.msgpackLength = 9;

  P.writeMsgpackTo = function(buffer, offset) {
    offset |= 0;
    buffer[offset] = token;
    this.toBuffer().copy(buffer, offset + 1);
    return 9;
  };
}
