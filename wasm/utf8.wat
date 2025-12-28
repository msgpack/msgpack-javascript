;; UTF-8 string processing using js-string-builtins with GC arrays
;; https://github.com/WebAssembly/js-string-builtins
;;
;; Uses WASM GC arrays with intoCharCodeArray/fromCharCodeArray
;; for efficient bulk string operations.

(module
  ;; GC array type for UTF-16 code units
  (type $i16_array (array (mut i16)))

  ;; Import js-string builtins
  (import "wasm:js-string" "length"
    (func $str_length (param externref) (result i32)))
  (import "wasm:js-string" "charCodeAt"
    (func $str_charCodeAt (param externref i32) (result i32)))
  (import "wasm:js-string" "intoCharCodeArray"
    (func $str_into_array (param externref (ref $i16_array) i32) (result i32)))
  (import "wasm:js-string" "fromCharCodeArray"
    (func $str_from_array (param (ref $i16_array) i32 i32) (result (ref extern))))

  ;; Linear memory for UTF-8 bytes (64KB initial)
  (memory (export "memory") 1)

  ;; Count UTF-8 byte length of a JS string
  (func (export "utf8Count") (param $str externref) (result i32)
    (local $len i32)
    (local $i i32)
    (local $byteLen i32)
    (local $code i32)

    (local.set $len (call $str_length (local.get $str)))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $code (call $str_charCodeAt (local.get $str) (local.get $i)))

        (if (i32.lt_u (local.get $code) (i32.const 0x80))
          (then
            ;; 1-byte: 0x00-0x7F
            (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 1))))
          (else
            (if (i32.lt_u (local.get $code) (i32.const 0x800))
              (then
                ;; 2-byte: 0x80-0x7FF
                (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 2))))
              (else
                (if (i32.and
                      (i32.ge_u (local.get $code) (i32.const 0xD800))
                      (i32.le_u (local.get $code) (i32.const 0xDBFF)))
                  (then
                    ;; 4-byte: surrogate pair, skip low surrogate
                    (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 4)))
                    (local.set $i (i32.add (local.get $i) (i32.const 1))))
                  (else
                    ;; 3-byte: 0x800-0xFFFF
                    (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 3)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $continue)))

    (local.get $byteLen))

  ;; Encode JS string to UTF-8 bytes at offset in linear memory
  ;; Returns number of bytes written
  (func (export "utf8Encode") (param $str externref) (param $offset i32) (result i32)
    (local $len i32)
    (local $arr (ref $i16_array))
    (local $i i32)
    (local $pos i32)
    (local $code i32)
    (local $code2 i32)

    (local.set $len (call $str_length (local.get $str)))
    (local.set $pos (local.get $offset))

    ;; Bulk copy all char codes into GC array
    (local.set $arr (array.new $i16_array (i32.const 0) (local.get $len)))
    (drop (call $str_into_array (local.get $str) (local.get $arr) (i32.const 0)))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $code (array.get_u $i16_array (local.get $arr) (local.get $i)))

        (if (i32.lt_u (local.get $code) (i32.const 0x80))
          (then
            ;; 1-byte: ASCII
            (i32.store8 (local.get $pos) (local.get $code))
            (local.set $pos (i32.add (local.get $pos) (i32.const 1))))
          (else
            (if (i32.lt_u (local.get $code) (i32.const 0x800))
              (then
                ;; 2-byte: 110xxxxx 10xxxxxx
                (i32.store8 (local.get $pos)
                  (i32.or (i32.const 0xC0) (i32.shr_u (local.get $code) (i32.const 6))))
                (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                  (i32.or (i32.const 0x80) (i32.and (local.get $code) (i32.const 0x3F))))
                (local.set $pos (i32.add (local.get $pos) (i32.const 2))))
              (else
                (if (i32.and
                      (i32.ge_u (local.get $code) (i32.const 0xD800))
                      (i32.le_u (local.get $code) (i32.const 0xDBFF)))
                  (then
                    ;; 4-byte: surrogate pair
                    (local.set $i (i32.add (local.get $i) (i32.const 1)))
                    (local.set $code2 (array.get_u $i16_array (local.get $arr) (local.get $i)))
                    ;; Decode: ((high - 0xD800) << 10) + (low - 0xDC00) + 0x10000
                    (local.set $code
                      (i32.add
                        (i32.const 0x10000)
                        (i32.add
                          (i32.shl
                            (i32.sub (local.get $code) (i32.const 0xD800))
                            (i32.const 10))
                          (i32.sub (local.get $code2) (i32.const 0xDC00)))))
                    ;; 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                    (i32.store8 (local.get $pos)
                      (i32.or (i32.const 0xF0) (i32.shr_u (local.get $code) (i32.const 18))))
                    (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                      (i32.or (i32.const 0x80)
                        (i32.and (i32.shr_u (local.get $code) (i32.const 12)) (i32.const 0x3F))))
                    (i32.store8 (i32.add (local.get $pos) (i32.const 2))
                      (i32.or (i32.const 0x80)
                        (i32.and (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0x3F))))
                    (i32.store8 (i32.add (local.get $pos) (i32.const 3))
                      (i32.or (i32.const 0x80) (i32.and (local.get $code) (i32.const 0x3F))))
                    (local.set $pos (i32.add (local.get $pos) (i32.const 4))))
                  (else
                    ;; 3-byte: 1110xxxx 10xxxxxx 10xxxxxx
                    (i32.store8 (local.get $pos)
                      (i32.or (i32.const 0xE0) (i32.shr_u (local.get $code) (i32.const 12))))
                    (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                      (i32.or (i32.const 0x80)
                        (i32.and (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0x3F))))
                    (i32.store8 (i32.add (local.get $pos) (i32.const 2))
                      (i32.or (i32.const 0x80) (i32.and (local.get $code) (i32.const 0x3F))))
                    (local.set $pos (i32.add (local.get $pos) (i32.const 3)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $continue)))

    (i32.sub (local.get $pos) (local.get $offset)))

  ;; Decode UTF-8 bytes from linear memory to GC array
  ;; Returns number of code units written
  (func (export "utf8DecodeToArray") (param $length i32) (param $arr (ref $i16_array)) (result i32)
    (local $pos i32)
    (local $end i32)
    (local $outIdx i32)
    (local $b1 i32)
    (local $b2 i32)
    (local $b3 i32)
    (local $b4 i32)
    (local $cp i32)

    (local.set $end (local.get $length))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $pos) (local.get $end)))

        (local.set $b1 (i32.load8_u (local.get $pos)))

        (if (i32.eqz (i32.and (local.get $b1) (i32.const 0x80)))
          (then
            ;; 1-byte: 0xxxxxxx
            (array.set $i16_array (local.get $arr) (local.get $outIdx) (local.get $b1))
            (local.set $outIdx (i32.add (local.get $outIdx) (i32.const 1)))
            (local.set $pos (i32.add (local.get $pos) (i32.const 1))))
          (else
            (if (i32.eq (i32.and (local.get $b1) (i32.const 0xE0)) (i32.const 0xC0))
              (then
                ;; 2-byte: 110xxxxx 10xxxxxx
                (local.set $b2 (i32.load8_u (i32.add (local.get $pos) (i32.const 1))))
                (array.set $i16_array (local.get $arr) (local.get $outIdx)
                  (i32.or
                    (i32.shl (i32.and (local.get $b1) (i32.const 0x1F)) (i32.const 6))
                    (i32.and (local.get $b2) (i32.const 0x3F))))
                (local.set $outIdx (i32.add (local.get $outIdx) (i32.const 1)))
                (local.set $pos (i32.add (local.get $pos) (i32.const 2))))
              (else
                (if (i32.eq (i32.and (local.get $b1) (i32.const 0xF0)) (i32.const 0xE0))
                  (then
                    ;; 3-byte: 1110xxxx 10xxxxxx 10xxxxxx
                    (local.set $b2 (i32.load8_u (i32.add (local.get $pos) (i32.const 1))))
                    (local.set $b3 (i32.load8_u (i32.add (local.get $pos) (i32.const 2))))
                    (array.set $i16_array (local.get $arr) (local.get $outIdx)
                      (i32.or
                        (i32.or
                          (i32.shl (i32.and (local.get $b1) (i32.const 0x0F)) (i32.const 12))
                          (i32.shl (i32.and (local.get $b2) (i32.const 0x3F)) (i32.const 6)))
                        (i32.and (local.get $b3) (i32.const 0x3F))))
                    (local.set $outIdx (i32.add (local.get $outIdx) (i32.const 1)))
                    (local.set $pos (i32.add (local.get $pos) (i32.const 3))))
                  (else
                    (if (i32.eq (i32.and (local.get $b1) (i32.const 0xF8)) (i32.const 0xF0))
                      (then
                        ;; 4-byte: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                        (local.set $b2 (i32.load8_u (i32.add (local.get $pos) (i32.const 1))))
                        (local.set $b3 (i32.load8_u (i32.add (local.get $pos) (i32.const 2))))
                        (local.set $b4 (i32.load8_u (i32.add (local.get $pos) (i32.const 3))))
                        (local.set $cp
                          (i32.sub
                            (i32.or
                              (i32.or
                                (i32.or
                                  (i32.shl (i32.and (local.get $b1) (i32.const 0x07)) (i32.const 18))
                                  (i32.shl (i32.and (local.get $b2) (i32.const 0x3F)) (i32.const 12)))
                                (i32.shl (i32.and (local.get $b3) (i32.const 0x3F)) (i32.const 6)))
                              (i32.and (local.get $b4) (i32.const 0x3F)))
                            (i32.const 0x10000)))
                        ;; High surrogate
                        (array.set $i16_array (local.get $arr) (local.get $outIdx)
                          (i32.or (i32.const 0xD800) (i32.shr_u (local.get $cp) (i32.const 10))))
                        (local.set $outIdx (i32.add (local.get $outIdx) (i32.const 1)))
                        ;; Low surrogate
                        (array.set $i16_array (local.get $arr) (local.get $outIdx)
                          (i32.or (i32.const 0xDC00) (i32.and (local.get $cp) (i32.const 0x3FF))))
                        (local.set $outIdx (i32.add (local.get $outIdx) (i32.const 1)))
                        (local.set $pos (i32.add (local.get $pos) (i32.const 4))))
                      (else
                        ;; Invalid byte, skip
                        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))))))))))

        (br $continue)))

    (local.get $outIdx))

  ;; Allocate GC array for UTF-16 code units
  (func (export "allocArray") (param $size i32) (result (ref $i16_array))
    (array.new $i16_array (i32.const 0) (local.get $size)))

  ;; Create string from GC array
  (func (export "arrayToString") (param $arr (ref $i16_array)) (param $start i32) (param $end i32) (result externref)
    (call $str_from_array (local.get $arr) (local.get $start) (local.get $end)))
)
