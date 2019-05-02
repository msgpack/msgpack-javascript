export type Writable<T> = {
  push(...bytes: ReadonlyArray<T>): void;
};
