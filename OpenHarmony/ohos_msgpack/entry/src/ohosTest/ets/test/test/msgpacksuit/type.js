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
/**
 * type.js
 */

import {MsgUInt64,MsgInt64} from "./msg-int64";
import { MsgTimestamp } from "../msg/msg-timestamp";
import  MsgExt from "../msg/msg-ext";

export default  Type;

Type.getType = getType;

Type.prototype.compare = compareStrict;
Type.prototype.parse = through;
Type.prototype.toString = toString;

var types = {};
types.array = new Type("array");
types.bignum = new Type("bignum");
types.binary = new Type("binary");
types.bool = new Type("bool");
types.ext = new Type("ext");
types.map = new Type("map");
types.nil = new Type("nil");
types.number = new Type("number");
types.string = new Type("string");
types.timestamp = new Type("timestamp");

types.array.compare = compareDeep;
types.bignum.compare = compareString;
types.binary.compare = compareBinary;
types.ext.compare = compareExt;
types.map.compare = compareMap;
types.number.compare = compareNumber;
types.string.compare = compareString;
types.timestamp.compare = compareString;

types.bignum.parse = parseBignum;
types.binary.parse = parseBinary;
types.ext.parse = parseExt;
types.timestamp.parse = parseTimestamp;

function Type(name) {
  if (!(this instanceof Type)) return new Type(name);
  this.name = name;
}

function toString() {
  return this.name;
}

function getType(type) {
  return types[type];
}

function through(value) {
  return value;
}

function parseBignum(str) {
  var orig = str += "";
  var parser = (str[0] === "-") ? MsgInt64 : MsgUInt64;
  str = str.replace(/0x/, "");
  var radix = (str !== orig) ? 16 : 10;
  return parser(str, radix);
}

function parseBinary(str) {
  var array = str && str.split(/[^0-9a-fA-F]+/g).map(parseHex) || [];
  return Buffer.from ? Buffer.from(array) : new Buffer(array);
}

function parseExt(array) {
  var type = array[0];
  var buffer = parseBinary(array[1]);
  return new MsgExt(buffer, type);
}

function parseHex(str) {
  return parseInt(str, 16) || 0;
}

function parseTimestamp(array) {
  return MsgTimestamp.from(array[0], array[1]);
}

function compareExt(a, b) {
  if (!a) return false;
  if (!b) return false;

  return (a.type === b.type) && compareBinary(a.buffer, b.buffer);
}

function compareString(a, b) {
  return "" + a === "" + b;
}

function compareNumber(a, b) {
  return +a === +b;
}

function compareStrict(a, b) {
  return a === b;
}

function compareBinary(a, b) {
  if (!a) return false;
  if (!b) return false;

  var aLen = a.length;
  var bLen = b.length;
  if (aLen !== bLen) return false;

  return [].every.call(a, function(value, idx) {
    return value === b[idx];
  });
}

function compareMap(a, b) {
  if (!a) return false;
  if (!b) return false;

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  return [].every.call(aKeys, function(key) {
    return (key in b) && compareDeep(a[key], b[key]);
  });
}

function compareDeep(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
