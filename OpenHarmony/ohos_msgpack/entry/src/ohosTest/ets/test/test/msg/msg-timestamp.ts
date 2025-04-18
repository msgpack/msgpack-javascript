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
"use strict";
import Buffer from '@ohos.buffer';
import {MsgExt} from "./msg-ext";
import {Int64BE} from "./int64-buffer";
import Timestamp from "./timestamp";

const BIT34 = 0x400000000;
const BIT32 = 0x100000000;
const EXTTYPE = -1;

/**
 * Timestamp extension type is assigned to extension type -1.
 */

export abstract class MsgTimestamp extends MsgExt {
    constructor(buffer) {
        super(buffer);
    }
    abstract getTime(): number;

    abstract getNano(): number;

    abstract toTimestamp(): Timestamp;

    toJSON(): string {
        return this.toTimestamp().toJSON();
    }

    toString(fmt?: string): string {
        return this.toTimestamp().toString(fmt);
    }

    toDate(): Date {
        return this.toTimestamp().toDate();
    }

    static from(timeT: number | Int64BE, nano?: number): MsgTimestamp {
        nano = 0 | nano as number;

        const time = +timeT;
        if (0 <= time && time < BIT32 && !nano) {
            return MsgTimestamp32.from(time);
        } else if (0 <= time && time < BIT34) {
            return MsgTimestamp64.from(time, nano);
        } else {
            return MsgTimestamp96.from(timeT, nano);
        }
    }

    static parse(buffer): MsgTimestamp {
        const length = buffer.length;

        switch (length) {
            case 4:
                return  new MsgTimestamp32(buffer);
            case 8:
                return new MsgTimestamp64(buffer);
            case 12:
                return new MsgTimestamp96(buffer);
            default:
                throw new TypeError("Invalid payload length: " + length);
        }
    }
}

// ext type -1

MsgTimestamp.prototype['type'] = EXTTYPE;

/**
 * Timestamp 32 format can represent a timestamp in [1970-01-01 00:00:00 UTC, 2106-02-07 06:28:16 UTC) range. Nanoseconds part is 0.
 */

export class MsgTimestamp32 extends MsgTimestamp {
    constructor(buffer) {
        super(buffer);
    }

    static from(time: number) {
        const payload = Buffer.alloc(4);

        // seconds in 32-bit unsigned int
        payload.writeUInt32BE(+time, 0);

        return new MsgTimestamp32(payload);
    }

    getTime() {
        // seconds in 32-bit unsigned int
        return this['buffer'].readUInt32BE(0);
    }

    getNano() {
        return 0;
    }

    toTimestamp() {
        const time = this.getTime();
        return Timestamp.fromTimeT(time);
    }
}

/**
 * Timestamp 64 format can represent a timestamp in [1970-01-01 00:00:00.000000000 UTC, 2514-05-30 01:53:04.000000000 UTC) range.
 */

export class MsgTimestamp64 extends MsgTimestamp {
    constructor(buffer) {
        super(buffer);
    }
    static from(time: number, nano?: number) {
        time = +time;
        nano = 0 | nano as number;

        const payload = Buffer.alloc(8);

        // nanoseconds in 30-bit unsigned int
        const high = (nano * 4) + ((time / BIT32) & 3);
        payload.writeUInt32BE(high, 0);

        // seconds in 34-bit unsigned int
        const low = time % BIT32;
        payload.writeUInt32BE(low, 4);

        return new MsgTimestamp64(payload);
    }

    getTime() {
        const high = this['buffer'][3] & 3;
        const low = this['buffer'].readUInt32BE(4);

        // seconds in 34-bit unsigned int
        return high * BIT32 + low;
    }

    getNano() {
        const high = this['buffer'].readUInt32BE(0);

        // nanoseconds in 30-bit unsigned int
        return Math.floor(high / 4);
    }

    toTimestamp() {
        const time = this.getTime();
        const nano = this.getNano();
        return Timestamp.fromTimeT(time).addNano(nano);
    }
}

/**
 * Timestamp 96 format can represent a timestamp in [-584554047284-02-23 16:59:44 UTC, 584554051223-11-09 07:00:16.000000000 UTC) range.
 */

export class MsgTimestamp96 extends MsgTimestamp {
    constructor(buffer) {
        super(buffer);
    }
    static from(time, nano?: number) {
        const payload = Buffer.alloc(12);
        nano = 0 | nano as number;

        // nanoseconds in 32-bit unsigned int
        payload.writeUInt32BE(nano, 0);

        // seconds in 64-bit signed int
        if (Int64BE.isInt64BE(time)) {
            time.toBuffer().copy(payload, 4);
        } else {
            new Int64BE(payload, 4, +time);
        }

        return new MsgTimestamp96(payload);
    }

    getTime() {
        // seconds in 64-bit signed int
        return new Int64BE(this['buffer'], 4).toNumber();
    }

    getNano() {
        // nanoseconds in 32-bit unsigned int
        return this['buffer'].readUInt32BE(0);
    }

    toTimestamp() {
        const nano = this.getNano();

        // seconds in 64-bit signed int
        return Timestamp.fromInt64BE(this['buffer'], 4).addNano(nano);
    }
}
