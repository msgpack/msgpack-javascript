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
import Buffer from '@ohos.buffer';
"use strict";

export default MsgExt;

/**
 * msgpack ext type container
 */

export function MsgExt(payload, type) {
  if (!(this instanceof MsgExt)) {
    return new MsgExt(payload, type);
  }

  if (!isNaN(payload) && Buffer.isBuffer(type)) {
    return MsgExt.call(this, type, +payload);
  }

  // ext type: -128 - +127
  if (type < -128 || 255 < type) {
    throw new RangeError("Invalid ext type: " + type);
  }

  if (-129 < type && type < 256) {
    this.type = type;
  }

  // payload
  if (payload && !Buffer.isBuffer(payload)) {
    payload = Buffer.from(payload);
  }

  if (!payload) {
    throw new TypeError("Invalid ext payload");
  }

  this.buffer = payload;
  this.msgpackLength = getByteLength(payload);
}

(function(P) {
  P.type = void 0;

  P.buffer = void 0;

  P.writeMsgpackTo = writeMsgpackTo;

})(MsgExt.prototype);

var fixedToken = [];
fixedToken[1] = 0xd4;
fixedToken[2] = 0xd5;
fixedToken[4] = 0xd6;
fixedToken[8] = 0xd7;
fixedToken[16] = 0xd8;

var flexToken = [];
flexToken[1] = 0xc7;
flexToken[2] = 0xc8;
flexToken[4] = 0xc9;

function writeMsgpackTo(buffer, offset) {
  var payload = this.buffer;
  var length = payload.length;

  offset |= 0;

  // token
  buffer[offset++] = getToken(length);

  // length for body length
  var addr = getAddressLength(length);
  if (addr === 1) {
    buffer.writeUInt8(length, offset);
  } else if (addr === 2) {
    buffer.writeUInt16BE(length, offset);
  } else if (addr === 4) {
    buffer.writeUInt32BE(length, offset);
  }
  offset += addr;

  // ext type
  buffer[offset++] = this.type & 255;

  // body
  payload.copy(buffer, offset, 0, length);

  return offset + length;
}

/**
 * @private
 */

function getToken(length) {
  return fixedToken[length] || flexToken[getAddressLength(length)];
}

function getByteLength(payload) {
  var length = payload && payload.length || 0;
  return 2 + getAddressLength(length) + length;
}

function getAddressLength(length) {
  return fixedToken[length] ? 0 : length > 65535 ? 4 : length > 255 ? 2 : 1;
}
