type NonMethodKeys<T> = ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [P in keyof T]: T[P] extends Function ? never : P;
} & Record<string, never>)[keyof T];
export type RemoveMethods<T> = Pick<T, NonMethodKeys<T>>;
