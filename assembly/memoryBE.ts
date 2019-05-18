// load/store values in big-endian

@inline
export function loadFload32BE(byteOffset: usize): f32 {
  return reinterpret<f32>(bswap<u32>(load<u32>(byteOffset)));
}

@inline
export function loadFloat64BE(byteOffset: usize): f64 {
  return reinterpret<f64>(bswap<u64>(load<u64>(byteOffset)));
}

@inline
export function loadInt8BE(byteOffset: usize): i8 {
  return load<i8>(byteOffset);
}

export function loadInt16BE(byteOffset: usize): i16 {
  return bswap<i16>(load<i16>(byteOffset));
}

@inline
export function loadInt32BE(byteOffset: usize): i32 {
  return bswap<i32>(load<i32>(byteOffset));
}

@inline
export function loadInt64BE(byteOffset: usize): i64 {
  return bswap<i64>(load<i64>(byteOffset));
}

@inline
export function loadUint8BE(byteOffset: usize): u8 {
  return load<u8>(byteOffset);
}

@inline
export function loadUint16BE(byteOffset: usize): u16 {
  return bswap<u16>(load<u16>(byteOffset));
}

@inline
export function loadUint32BE(byteOffset: usize): u32 {
  return bswap<u32>(load<u32>(byteOffset));
}

@inline
export function loadUint64BE(byteOffset: usize): u64 {
  return bswap<u64>(load<u64>(byteOffset));
}

@inline
export function storeFloat32BE(byteOffset: usize, value: f32): void {
  store<u32>(byteOffset, bswap<u32>(reinterpret<u32>(value)));
}

@inline
export function storeFloat64BE(byteOffset: usize, value: f64): void {
  store<u64>(byteOffset, bswap<u64>(reinterpret<u64>(value)));
}

@inline
export function storeInt8BE(byteOffset: usize, value: i8): void {
  store<i8>(byteOffset, value);
}

@inline
export function storeInt16BE(byteOffset: usize, value: i16): void {
  store<i16>(byteOffset, bswap<i16>(value));
}

@inline
export function storeInt32BE(byteOffset: usize, value: i32): void {
  store<i32>(byteOffset, bswap<i32>(value));
}

@inline
export function storeInt64BE(byteOffset: usize, value: i64): void {
  store<i64>(byteOffset, bswap<i64>(value));
}

@inline
export function storeUint8BE(byteOffset: usize, value: u8): void {
  store<u8>(byteOffset, value);
}

@inline
export function storeUint16BE(byteOffset: usize, value: u16): void {
  store<u16>(byteOffset, bswap<u16>(value));
}

@inline
export function storeUint32BE(byteOffset: usize, value: u32): void {
  store<u32>(byteOffset, bswap<u32>(value));
}

@inline
export function storeUint64BE(byteOffset: usize, value: u64): void {
  store<u64>(byteOffset, bswap<u64>(value));
}
