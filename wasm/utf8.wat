;; UTF-8 string processing using js-string-builtins
;; https://github.com/WebAssembly/js-string-builtins

(module
  ;; Import js-string builtins
  ;; Note: string parameters use externref, string returns use (ref extern)
  (import "wasm:js-string" "length"
    (func $str_length (param externref) (result i32)))
  (import "wasm:js-string" "charCodeAt"
    (func $str_charCodeAt (param externref i32) (result i32)))
  (import "wasm:js-string" "fromCharCode"
    (func $str_fromCharCode (param i32) (result (ref extern))))
  (import "wasm:js-string" "concat"
    (func $str_concat (param externref externref) (result (ref extern))))

  ;; Linear memory layout:
  ;; - 0 to 32KB: UTF-8 input bytes
  ;; - 32KB onwards: UTF-16 code units output (i16 array)
  (memory (export "memory") 1)

  ;; Offset where UTF-16 output starts (32KB = 32768)
  (global $utf16_offset i32 (i32.const 32768))

  ;; Count UTF-8 byte length of a JS string
  ;; This is equivalent to Buffer.byteLength(str, 'utf8') or TextEncoder().encode(str).length
  (func (export "utf8Count") (param $str externref) (result i32)
    (local $i i32)
    (local $len i32)
    (local $byteLen i32)
    (local $code i32)

    (local.set $len (call $str_length (local.get $str)))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $code (call $str_charCodeAt (local.get $str) (local.get $i)))

        ;; 1-byte: 0x00-0x7F
        (if (i32.lt_u (local.get $code) (i32.const 0x80))
          (then
            (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 1))))
        ;; 2-byte: 0x80-0x7FF
          (else (if (i32.lt_u (local.get $code) (i32.const 0x800))
            (then
              (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 2))))
        ;; Check for surrogate pair (high surrogate: 0xD800-0xDBFF)
            (else (if (i32.and
                        (i32.ge_u (local.get $code) (i32.const 0xD800))
                        (i32.le_u (local.get $code) (i32.const 0xDBFF)))
              ;; 4-byte: surrogate pair, skip next char (low surrogate)
              (then
                (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 4)))
                (local.set $i (i32.add (local.get $i) (i32.const 1))))
              ;; 3-byte: 0x800-0xFFFF (excluding surrogates)
              (else
                (local.set $byteLen (i32.add (local.get $byteLen) (i32.const 3)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $continue)))

    (local.get $byteLen))

  ;; Encode JS string to UTF-8 bytes at offset in linear memory
  ;; Returns number of bytes written
  (func (export "utf8Encode") (param $str externref) (param $offset i32) (result i32)
    (local $i i32)
    (local $len i32)
    (local $pos i32)
    (local $code i32)
    (local $code2 i32)

    (local.set $len (call $str_length (local.get $str)))
    (local.set $pos (local.get $offset))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $i) (local.get $len)))

        (local.set $code (call $str_charCodeAt (local.get $str) (local.get $i)))

        ;; 1-byte: ASCII (0x00-0x7F)
        (if (i32.lt_u (local.get $code) (i32.const 0x80))
          (then
            (i32.store8 (local.get $pos) (local.get $code))
            (local.set $pos (i32.add (local.get $pos) (i32.const 1))))

        ;; 2-byte: 0x80-0x7FF
          (else (if (i32.lt_u (local.get $code) (i32.const 0x800))
            (then
              (i32.store8 (local.get $pos)
                (i32.or (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0xC0)))
              (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                (i32.or (i32.and (local.get $code) (i32.const 0x3F)) (i32.const 0x80)))
              (local.set $pos (i32.add (local.get $pos) (i32.const 2))))

        ;; Check for high surrogate (0xD800-0xDBFF)
            (else (if (i32.and
                        (i32.ge_u (local.get $code) (i32.const 0xD800))
                        (i32.le_u (local.get $code) (i32.const 0xDBFF)))
              ;; 4-byte: surrogate pair
              (then
                ;; Get low surrogate
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (local.set $code2 (call $str_charCodeAt (local.get $str) (local.get $i)))
                ;; Calculate code point: ((high - 0xD800) << 10) + (low - 0xDC00) + 0x10000
                (local.set $code
                  (i32.add
                    (i32.add
                      (i32.shl
                        (i32.sub (local.get $code) (i32.const 0xD800))
                        (i32.const 10))
                      (i32.sub (local.get $code2) (i32.const 0xDC00)))
                    (i32.const 0x10000)))
                ;; Encode 4-byte UTF-8
                (i32.store8 (local.get $pos)
                  (i32.or (i32.shr_u (local.get $code) (i32.const 18)) (i32.const 0xF0)))
                (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                  (i32.or (i32.and (i32.shr_u (local.get $code) (i32.const 12)) (i32.const 0x3F)) (i32.const 0x80)))
                (i32.store8 (i32.add (local.get $pos) (i32.const 2))
                  (i32.or (i32.and (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0x3F)) (i32.const 0x80)))
                (i32.store8 (i32.add (local.get $pos) (i32.const 3))
                  (i32.or (i32.and (local.get $code) (i32.const 0x3F)) (i32.const 0x80)))
                (local.set $pos (i32.add (local.get $pos) (i32.const 4))))

              ;; 3-byte: 0x800-0xFFFF (excluding surrogates)
              (else
                (i32.store8 (local.get $pos)
                  (i32.or (i32.shr_u (local.get $code) (i32.const 12)) (i32.const 0xE0)))
                (i32.store8 (i32.add (local.get $pos) (i32.const 1))
                  (i32.or (i32.and (i32.shr_u (local.get $code) (i32.const 6)) (i32.const 0x3F)) (i32.const 0x80)))
                (i32.store8 (i32.add (local.get $pos) (i32.const 2))
                  (i32.or (i32.and (local.get $code) (i32.const 0x3F)) (i32.const 0x80)))
                (local.set $pos (i32.add (local.get $pos) (i32.const 3)))))))))

        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $continue)))

    (i32.sub (local.get $pos) (local.get $offset)))

  ;; Decode UTF-8 bytes to UTF-16 code units in memory
  ;; Reads UTF-8 from offset 0 for $length bytes
  ;; Writes UTF-16 code units to utf16_offset
  ;; Returns number of UTF-16 code units written
  (func (export "utf8DecodeToMemory") (param $length i32) (result i32)
    (local $pos i32)
    (local $end i32)
    (local $outPos i32)
    (local $byte1 i32)
    (local $byte2 i32)
    (local $byte3 i32)
    (local $byte4 i32)
    (local $codePoint i32)

    (local.set $pos (i32.const 0))
    (local.set $end (local.get $length))
    (local.set $outPos (global.get $utf16_offset))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $pos) (local.get $end)))

        (local.set $byte1 (i32.load8_u (local.get $pos)))

        ;; 1-byte: 0xxxxxxx
        (if (i32.eqz (i32.and (local.get $byte1) (i32.const 0x80)))
          (then
            (i32.store16 (local.get $outPos) (local.get $byte1))
            (local.set $outPos (i32.add (local.get $outPos) (i32.const 2)))
            (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
            (br $continue)))

        ;; 2-byte: 110xxxxx 10xxxxxx
        (if (i32.eq (i32.and (local.get $byte1) (i32.const 0xE0)) (i32.const 0xC0))
          (then
            (local.set $byte2 (i32.load8_u (i32.add (local.get $pos) (i32.const 1))))
            (local.set $codePoint
              (i32.or
                (i32.shl (i32.and (local.get $byte1) (i32.const 0x1F)) (i32.const 6))
                (i32.and (local.get $byte2) (i32.const 0x3F))))
            (i32.store16 (local.get $outPos) (local.get $codePoint))
            (local.set $outPos (i32.add (local.get $outPos) (i32.const 2)))
            (local.set $pos (i32.add (local.get $pos) (i32.const 2)))
            (br $continue)))

        ;; 3-byte: 1110xxxx 10xxxxxx 10xxxxxx
        (if (i32.eq (i32.and (local.get $byte1) (i32.const 0xF0)) (i32.const 0xE0))
          (then
            (local.set $byte2 (i32.load8_u (i32.add (local.get $pos) (i32.const 1))))
            (local.set $byte3 (i32.load8_u (i32.add (local.get $pos) (i32.const 2))))
            (local.set $codePoint
              (i32.or
                (i32.or
                  (i32.shl (i32.and (local.get $byte1) (i32.const 0x0F)) (i32.const 12))
                  (i32.shl (i32.and (local.get $byte2) (i32.const 0x3F)) (i32.const 6)))
                (i32.and (local.get $byte3) (i32.const 0x3F))))
            (i32.store16 (local.get $outPos) (local.get $codePoint))
            (local.set $outPos (i32.add (local.get $outPos) (i32.const 2)))
            (local.set $pos (i32.add (local.get $pos) (i32.const 3)))
            (br $continue)))

        ;; 4-byte: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        (if (i32.eq (i32.and (local.get $byte1) (i32.const 0xF8)) (i32.const 0xF0))
          (then
            (local.set $byte2 (i32.load8_u (i32.add (local.get $pos) (i32.const 1))))
            (local.set $byte3 (i32.load8_u (i32.add (local.get $pos) (i32.const 2))))
            (local.set $byte4 (i32.load8_u (i32.add (local.get $pos) (i32.const 3))))
            (local.set $codePoint
              (i32.or
                (i32.or
                  (i32.or
                    (i32.shl (i32.and (local.get $byte1) (i32.const 0x07)) (i32.const 18))
                    (i32.shl (i32.and (local.get $byte2) (i32.const 0x3F)) (i32.const 12)))
                  (i32.shl (i32.and (local.get $byte3) (i32.const 0x3F)) (i32.const 6)))
                (i32.and (local.get $byte4) (i32.const 0x3F))))
            ;; Convert to surrogate pair
            (local.set $codePoint (i32.sub (local.get $codePoint) (i32.const 0x10000)))
            ;; High surrogate
            (i32.store16 (local.get $outPos)
              (i32.or
                (i32.shr_u (local.get $codePoint) (i32.const 10))
                (i32.const 0xD800)))
            (local.set $outPos (i32.add (local.get $outPos) (i32.const 2)))
            ;; Low surrogate
            (i32.store16 (local.get $outPos)
              (i32.or
                (i32.and (local.get $codePoint) (i32.const 0x3FF))
                (i32.const 0xDC00)))
            (local.set $outPos (i32.add (local.get $outPos) (i32.const 2)))
            (local.set $pos (i32.add (local.get $pos) (i32.const 4)))
            (br $continue)))

        ;; Invalid byte, skip
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
        (br $continue)))

    ;; Return number of UTF-16 code units written
    (i32.shr_u (i32.sub (local.get $outPos) (global.get $utf16_offset)) (i32.const 1)))
)
