export type ExcludeSuperProperties<S, C extends S> = {
  [K in Exclude<keyof C, keyof S>]: C[K];
};
