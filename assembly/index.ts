// The entry file of your WebAssembly module.

// memory is assumed:
// [input][output]
export { utf8DecodeToUint16Array } from "./utf8DecodeToUint16Array";
export { malloc, free } from "./memory";
