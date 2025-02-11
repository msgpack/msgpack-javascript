// Polyfill to Symbol.dispose

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!Symbol.dispose) {
  Object.defineProperty(Symbol, "dispose", {
    value: Symbol("dispose"),
    writable: false,
    enumerable: false,
    configurable: false,
  });
}
