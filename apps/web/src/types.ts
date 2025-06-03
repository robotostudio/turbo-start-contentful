export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Maybe<T> = T | null | undefined;
