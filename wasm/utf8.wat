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

  ;; Linear memory for UTF-8 bytes (64KB initial, exported for JS access)
  (memory (export "memory") 1)

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

  ;; Decode UTF-8 bytes from linear memory to JS string
  ;; Reads from offset for length bytes
  (func (export "utf8Decode") (param $offset i32) (param $length i32) (result externref)
    (local $pos i32)
    (local $end i32)
    (local $result externref)
    (local $byte1 i32)
    (local $byte2 i32)
    (local $byte3 i32)
    (local $byte4 i32)
    (local $codePoint i32)

    (local.set $pos (local.get $offset))
    (local.set $end (i32.add (local.get $offset) (local.get $length)))
    ;; Start with empty string (NUL char, will be trimmed by JS side if needed)
    (local.set $result (call $str_fromCharCode (i32.const 0)))

    (block $break
      (loop $continue
        (br_if $break (i32.ge_u (local.get $pos) (local.get $end)))

        (local.set $byte1 (i32.load8_u (local.get $pos)))

        ;; 1-byte: 0xxxxxxx
        (if (i32.eqz (i32.and (local.get $byte1) (i32.const 0x80)))
          (then
            (local.set $result
              (call $str_concat
                (local.get $result)
                (call $str_fromCharCode (local.get $byte1))))
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
            (local.set $result
              (call $str_concat
                (local.get $result)
                (call $str_fromCharCode (local.get $codePoint))))
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
            (local.set $result
              (call $str_concat
                (local.get $result)
                (call $str_fromCharCode (local.get $codePoint))))
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
            (local.set $result
              (call $str_concat
                (local.get $result)
                (call $str_fromCharCode
                  (i32.or
                    (i32.shr_u (local.get $codePoint) (i32.const 10))
                    (i32.const 0xD800)))))
            ;; Low surrogate
            (local.set $result
              (call $str_concat
                (local.get $result)
                (call $str_fromCharCode
                  (i32.or
                    (i32.and (local.get $codePoint) (i32.const 0x3FF))
                    (i32.const 0xDC00)))))
            (local.set $pos (i32.add (local.get $pos) (i32.const 4)))
            (br $continue)))

        ;; Invalid byte, skip
        (local.set $pos (i32.add (local.get $pos) (i32.const 1)))
        (br $continue)))

    ;; Result has leading NUL char - JS side will slice it off
    (local.get $result))
)
