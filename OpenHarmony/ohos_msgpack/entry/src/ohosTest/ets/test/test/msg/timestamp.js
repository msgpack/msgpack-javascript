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
var Timestamp = (function() {


  var SEC_DAY = 24 * 3600; // seconds per day
  var YEAR_SLOT = 3200; // years per slot
  var DAY_SLOT = (365 * 400 + 97) * YEAR_SLOT / 400; // days per slot
  var SEC_SLOT = SEC_DAY * DAY_SLOT; // seconds per slot
  var MSEC_SLOT = SEC_SLOT * 1000; // mseconds per slot

  // 15.9.1.1 Time Values and Time Range
  // The actual range of times supported by ECMAScript Date objects is
  // exactly –100,000,000 days to 100,000,000 days measured relative to
  // midnight at the beginning of 01 January, 1970 UTC.
  var MAX_MSEC = 1000 * 10000 * 10000 * SEC_DAY;

  var BIT24 = 0x1000000;
  var BIT32 = 0x10000 * 0x10000;
  var DEC6 = 1000 * 1000;
  var DEC9 = 1000 * 1000 * 1000;
  var ZERO9 = "000000000";

  var trunc = Math.trunc || Math_trunc;
  var P = Timestamp.prototype;

  // static methods
  Timestamp.fromDate = fromDate;
  Timestamp.fromInt64BE = buildFromInt64(0, 1, 2, 3, 0, 4);
  Timestamp.fromInt64LE = buildFromInt64(3, 2, 1, 0, 4, 0);
  Timestamp.fromString = fromString;
  Timestamp.fromTimeT = fromTimeT;

  // private properties
  P.year = 0; // Offset number for year precision
  P.time = 0; // Milliseconds from epoch
  P.nano = 0; // Offset number for nanosecond precision

  // instance methods
  P.addNano = addNano;
  P.getNano = getNano;
  P.getTimeT = getTimeT;
  P.getYear = getYear;
  P.toDate = toDate;
  P.toJSON = toJSON;
  P.toString = toString;
  P.writeInt64BE = buildWriteInt64(0, 1, 2, 3, 0, 4);
  P.writeInt64LE = buildWriteInt64(3, 2, 1, 0, 4, 0);

  var FMT_JSON = "%Y-%m-%dT%H:%M:%S.%NZ";

  var FMT_MONTH = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  var FMT_DAY = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  var FMT_STRING = {
    "%": "%",
    F: "%Y-%m-%d",
    n: "\n",
    R: "%H:%M",
    T: "%H:%M:%S",
    t: "\t",
    X: "%T",
    Z: "GMT",
    z: "+0000"
  };

  return Timestamp;

  function Timestamp(time, nano, year) {
    var ts = this;
    if (!(ts instanceof Timestamp)) return new Timestamp(time, nano, year);
    ts.time = +time || 0;
    ts.nano = +nano || 0;
    ts.year = +year || 0;
    normalize(ts);
  }

  function getYear() {
    var year = this.toDate().getUTCFullYear();
    return year + this.year;
  }

  function normalize(ts) {
    var year = ts.year;
    var time = ts.time;
    var nano = ts.nano;
    var changed;
    var slot;

    // normalize nano
    if (nano < 0 || DEC6 <= nano) {
      var n = Math.floor(nano / DEC6);
      nano -= n * DEC6;
      time += n;
      changed = 1;
    }

    var y = year % YEAR_SLOT;
    if (time < -MAX_MSEC || MAX_MSEC < time || y) {
      // shrink time into the minimal slot
      slot = trunc(time / MSEC_SLOT);
      if (slot) {
        year += slot * YEAR_SLOT;
        time -= slot * MSEC_SLOT;
      }

      // add year offset smaller than a slot
      var dt = newDate(time);
      dt.setUTCFullYear(y + dt.getUTCFullYear());
      year -= y;
      time = +dt;

      // use full range of 100 million days.
      slot = trunc(year / YEAR_SLOT);
      var total = time + slot * MSEC_SLOT;
      if (slot && -MAX_MSEC <= total && total <= MAX_MSEC) {
        year -= slot * YEAR_SLOT;
        time = total;
      }

      changed = 1;
    }

    if (changed) {
      ts.year = year;
      ts.time = time;
      ts.nano = nano;
    }

    return ts;
  }

  function toDate() {
    var ts = normalize(this);
    return newDate(ts.time);
  }

  function newDate(time) {
    var dt = new Date(0);
    dt.setTime(time);
    return dt;
  }

  function addNano(nano) {
    this.nano += +nano || 0;
    return this;
  }

  function getNano() {
    var ts = normalize(this);
    return ((ts.time % 1000) * DEC6 + (+ts.nano) + DEC9) % DEC9;
  }

  function fromString(string) {
    var time;
    var ts = new Timestamp();
    string += "";

    var array = string.replace(/^\s*[+\-]?\d+/, function(match) {
      var year = +match;
      // Use only years around 1970 to avoid Date's terrible behavior:
      // 15.9.4.3 Date.UTC
      // If y is not NaN and 0 <= y <= 99, then let yr be 1900+y
      var y = 1970 + ((year - 1970) % 400);
      ts.year = year - y;
      return y;
    }).replace(/(?:Z|([+\-]\d{2}):?(\d{2}))$/, function(match, hour, min) {
      // time zone
      if (hour < 0) min *= -1;
      time = ((+hour) * 60 + (+min)) * 60000;
      return "";
    }).replace(/\.\d+$/, function(match) {
      // nanoseconds
      ts.nano = +((match + ZERO9).substr(1, 9));
      return "";
    }).split(/\D+/);

    if (array.length > 1) {
      array[1]--; // month starts from 0
    } else {
      array[1] = 0;
    }

    ts.time = time = Date.UTC.apply(Date, array) - (time || 0);

    if (isNaN(time)) {
      throw new TypeError("Invalid Date");
    }

    return normalize(ts);
  }

  function fromDate(date) {
    return new Timestamp(+date);
  }

  function fromTimeT(time) {
    return fromTime(time, 0);
  }

  function fromTime(low, high) {
    high |= 0;
    high *= BIT32;
    low = +low || 0;

    // slot count
    var slot = trunc(high / SEC_SLOT) + trunc(low / SEC_SLOT);

    // seconds within slot
    var second = (high % SEC_SLOT) + (low % SEC_SLOT);

    // slot offset
    var offset = trunc(second / SEC_SLOT);
    if (offset) {
      slot += offset;
      second -= offset * SEC_SLOT;
    }

    return new Timestamp(second * 1000, 0, slot * YEAR_SLOT);
  }

  function getTimeT() {
    var ts = normalize(this);
    var time = Math.floor(ts.time / 1000);

    var year = ts.year;
    if (year) time += year * DAY_SLOT * SEC_DAY / YEAR_SLOT;

    // this may loose some bits over than 53 bit precision
    return time;
  }

  function toJSON() {
    return this.toString().replace(/0{1,6}Z$/, "Z");
  }

  function toString(format) {
    var ts = this;
    var dt = ts.toDate();
    var map = {
      H: H,
      L: L,
      M: M,
      N: N,
      S: S,
      Y: Y,
      a: a,
      b: b,
      d: d,
      e: e,
      m: m,
      s: s
    };

    return strftime(format || FMT_JSON);

    function strftime(format) {
      return format.replace(/%./g, function(match) {
        var m = match[1];
        var c = FMT_STRING[m];
        var f = map[m];
        return c ? strftime(c) : f ? f() : match;
      });
    }

    function Y() {
      var year = ts.getYear();
      if (year > 999999) {
        return "+" + year;
      } else if (year > 9999) {
        return "+" + pad(year, 6);
      } else if (year >= 0) {
        return pad(year, 4);
      } else if (year >= -999999) {
        return "-" + pad(-year, 6);
      } else {
        return year;
      }
    }

    function m() {
      return pad2(dt.getUTCMonth() + 1);
    }

    function d() {
      return pad2(dt.getUTCDate());
    }

    function e() {
      return padS(dt.getUTCDate());
    }

    function H() {
      return pad2(dt.getUTCHours());
    }

    function M() {
      return pad2(dt.getUTCMinutes());
    }

    function S() {
      return pad2(dt.getUTCSeconds());
    }

    function L() {
      return pad(dt.getUTCMilliseconds(), 3);
    }

    function N() {
      return pad(ts.getNano(), 9);
    }

    function a() {
      return FMT_DAY[dt.getUTCDay()];
    }

    function b() {
      return FMT_MONTH[dt.getUTCMonth()];
    }

    function s() {
      return ts.getTimeT();
    }
  }

  function buildWriteInt64(pos0, pos1, pos2, pos3, posH, posL) {
    return writeInt64;

    function writeInt64(buffer, offset) {
      var ts = normalize(this);
      if (!buffer) buffer = new Array(8);
      checkRange(buffer, offset |= 0);

      var second = Math.floor(ts.time / 1000);
      var day = ts.year * (DAY_SLOT * SEC_DAY / YEAR_SLOT);
      var high = trunc(day / BIT32) + trunc(second / BIT32);
      var low = (day % BIT32) + (second % BIT32);

      // slot offset
      var slot = Math.floor(low / BIT32);
      if (slot) {
        high += slot;
        low -= slot * BIT32;
      }

      writeUint32(buffer, offset + posH, high);
      writeUint32(buffer, offset + posL, low);
      return buffer;
    }

    function writeUint32(buffer, offset, value) {
      buffer[offset + pos0] = (value >> 24) & 255;
      buffer[offset + pos1] = (value >> 16) & 255;
      buffer[offset + pos2] = (value >> 8) & 255;
      buffer[offset + pos3] = value & 255;
    }
  }

  function buildFromInt64(pos0, pos1, pos2, pos3, posH, posL) {
    return fromInt64;

    function fromInt64(buffer, offset) {
      checkRange(buffer, offset |= 0);
      var high = readUint32(buffer, offset + posH);
      var low = readUint32(buffer, offset + posL);
      return fromTime(low, high);
    }

    function readUint32(buffer, offset) {
      return (buffer[offset + pos0] * BIT24) +
        ((buffer[offset + pos1] << 16) |
          (buffer[offset + pos2] << 8) |
          buffer[offset + pos3]);
    }
  }

  function checkRange(buffer, offset) {
    var last = buffer && buffer.length;
    if (last == null) throw new TypeError("Invalid Buffer");
    if (last < offset + 8) throw new RangeError("Out of range");
  }

  function Math_trunc(x) {
    var n = x - x % 1;
    return n === 0 && (x < 0 || (x === 0 && (1 / x !== 1 / 0))) ? -0 : n;
  }

  function padS(v) {
    return (v > 9 ? "" : " ") + (v | 0);
  }

  function pad2(v) {
    return (v > 9 ? "" : "0") + (v | 0);
  }

  function pad(v, len) {
    return (ZERO9 + (v | 0)).substr(-len);
  }
})();
export default Timestamp;