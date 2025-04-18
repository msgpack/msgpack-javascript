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
/**
 * group.js
 */



import suite from "./msgpack-test-suite.json";
import {Exam} from "./exam";

export function Group(name) {
  if (!(this instanceof Group)) return new Group(name);
  this.name = name;
}

Group.getGroups = getGroups;

Group.prototype.getExams = getExams;
Group.prototype.toString = toString;

function getGroups() {
  return Object.keys(suite).sort().map(Group);
}

function getExams(filter) {
  var name = this.name;
  var array = suite[name];

  if (!array) throw new Error("Group not found: " + name);

  return array.map(Exam).filter(function(exam) {
    return !filter || exam.getTypes(filter).length;
  });
}

function toString() {
  return this.name;
}