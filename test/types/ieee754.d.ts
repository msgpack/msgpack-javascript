declare module "ieee754" {
  function read(buf: ArrayLike<number>, offset: number, isLE: boolean, mLen: number, nBytes: number): number;
  function write(
    buf: ArrayLike<number>,
    value: number,
    index: number,
    isLE: boolean,
    mLen: number,
    nBytes: number,
  ): void;
}
