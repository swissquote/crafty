// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#improved-intersection-reduction-union-compatibility-and-narrowing
export function f(x: unknown, y: {} | null | undefined) {
  /* eslint-disable no-param-reassign */
  x = y; // always worked
  y = x; // used to error, now works
}
