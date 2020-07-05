/* eslint-disable @typescript-eslint/ban-types */

export type SplitTypes<T, U> = U extends T ? U : Exclude<T, U>;
export type SplitUndefined<T> = SplitTypes<T, undefined>;

export type ContextOf<ContextType> = ContextType extends undefined
  ? {}
  : {
      /**
       * Custom user-defined data, read/writable
       */
      context: ContextType;
    };
