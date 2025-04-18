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
// msg-interface

/**
 * @see https://github.com/kawanet/msg-interface
 */

export interface MsgInterface {
    /**
     * expected maximum length of msgpack representation in bytes
     */
    msgpackLength: number;

    /**
     * write the msgpack representation to the buffer with an optional offset address
     * @return {number} actual length of written in bytes
     */
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}

/**
 * @return {boolean} true when the argument has the MsgInterface implemented
 */

export function isMsg(msg: any): boolean {
    return !!(msg && msg.msgpackLength >= 0 && msg.writeMsgpackTo);
}

/**
 * @return {Buffer} msgpack representation
 */

export function msgToBuffer(msg: MsgInterface): Buffer {
    const expected = +msg.msgpackLength;

    if (isNaN(expected)) {
        throw new Error("Invalid msgpackLength");
    }

    let buffer = Buffer.alloc(expected);
    const actual = +msg.writeMsgpackTo(buffer, 0);

    // trim
    if (expected > actual) {
        buffer = buffer.slice(0, actual);
    }

    return buffer;
}
