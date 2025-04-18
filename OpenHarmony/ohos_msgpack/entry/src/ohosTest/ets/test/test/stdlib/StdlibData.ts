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

import { ExtData } from '@ohos/msgpack';
import { seq } from './Stdlib';

export const data1 = {
  isCommunication: false,
  isWarning: false,
  alarmId: "619f65a2774abf00568b7210",
  intervalStart: "2022-05-20T12:00:00.000Z",
  intervalStop: "2022-05-20T13:00:00.000Z",
  triggeredAt: "2022-05-20T13:00:00.000Z",
  component: "someComponent",
  _id: "6287920245a582301475627d",
};

export const data2 = {
  foo: "bar",
};

export const o = {
  foo: "bar",
};

export const reuseobject = {
  nil: null,
  integer: 1,
  float: Math.PI,
  string: "Hello, world!",
  binary: Uint8Array.from([1, 2, 3]),
  array: [10, 20, 30],
  map: { foo: "bar" },
  timestampExt: new Date(),
};

export const SPECS = {
  FIXEXT1: [0xd4, new ExtData(0, seq(1))],
  FIXEXT2: [0xd5, new ExtData(0, seq(2))],
  FIXEXT4: [0xd6, new ExtData(0, seq(4))],
  FIXEXT8: [0xd7, new ExtData(0, seq(8))],
  FIXEXT16: [0xd8, new ExtData(0, seq(16))],
  EXT8: [0xc7, new ExtData(0, seq(17))],
  EXT16: [0xc8, new ExtData(0, seq(0x100))],
  EXT32: [0xc9, new ExtData(0, seq(0x10000))],
} as Record<string, [number, ExtData]>;

export const TEST_TYPES = {
  array: 1,
  bignum: 0, // TODO
  binary: 1,
  bool: 1,
  map: 1,
  nil: 1,
  number: 1,
  string: 1,
  timestamp: 1,
};

export const floatSPECS = {
  POSITIVE_ZERO: +0.0,
  NEGATIVE_ZERO: -0.0,
  POSITIVE_INFINITY: Number.POSITIVE_INFINITY,
  NEGATIVE_INFINITY: Number.NEGATIVE_INFINITY,

  POSITIVE_VALUE_1: +0.1,
  POSITIVE_VALUE_2: +42,
  POSITIVE_VALUE_3: +Math.PI,
  POSITIVE_VALUE_4: +Math.E,
  NEGATIVE_VALUE_1: -0.1,
  NEGATIVE_VALUE_2: -42,
  NEGATIVE_VALUE_3: -Math.PI,
  NEGATIVE_VALUE_4: -Math.E,

  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,

  MAX_VALUE: Number.MAX_VALUE,
  MIN_VALUE: Number.MIN_VALUE,
} as Record<string, number>;

export const INT64SPECS = {
  ZERO: 0,
  ONE: 1,
  MINUS_ONE: -1,
  X_FF: 0xff,
  MINUS_X_FF: -0xff,
  INT32_MAX: 0x7fffffff,
  INT32_MIN: -0x7fffffff - 1,
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
} as Record<string, number>;

const TIME = 1556636810389;
export const timestampSPECS = {
  ZERO: new Date(0),
  TIME_BEFORE_EPOCH_NS: new Date(-1),
  TIME_BEFORE_EPOCH_SEC: new Date(-1000),
  TIME_BEFORE_EPOCH_SEC_AND_NS: new Date(-1002),
  TIMESTAMP32: new Date(Math.floor(TIME / 1000) * 1000),
  TIMESTAMP64: new Date(TIME),
  TIMESTAMP64_OVER_INT32: new Date(Date.UTC(2200, 0)), // cf. https://github.com/msgpack/msgpack-ruby/pull/172
  TIMESTAMP96_SEC_OVER_UINT32: new Date(0x400000000 * 1000),
  TIMESTAMP96_SEC_OVER_UINT32_WITH_NS: new Date(0x400000000 * 1000 + 2),

  REGRESSION_1: new Date(1556799054803),
} as Record<string, Date>;

export const decodeobject = {
  foo: 1,
  bar: 2,
  baz: ["one", "two", "three"],
};

export const decodeOption = {
  maxStrLength: 1
};

export const decodeAsyncObject = {
  nil: null,
  true: true,
  false: false,
  int: -42,
  uint64: Number.MAX_SAFE_INTEGER,
  int64: Number.MIN_SAFE_INTEGER,
  float: Math.PI,
  string: "Hello, world!",
  longString: "Hello, world!\n".repeat(100),
  binary: Uint8Array.from([0xf1, 0xf2, 0xf3]),
  array: [1000, 2000, 3000],
  map: {
    foo: 1, bar: 2, baz: 3
  },
  timestampExt: new Date(),
  map0: {},
  array0: [],
  str0: "",
  bin0: Uint8Array.from([]),
};