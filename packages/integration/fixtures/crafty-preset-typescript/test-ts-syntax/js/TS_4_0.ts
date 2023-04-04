// Typescript 4.0
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#unknown-on-catch-clause-bindings
export function catchUnkown(): boolean {
  try {
    throw new Error();
    // Typescript 4.0 : unknown type on catch
  } catch (e) {
    if (typeof e === "string") {
      return true;
    }
  }

  return false;
}

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types
type Strings = [string, string];
type Numbers = [number, number];
type StrStrNumNumBool = [...Strings, ...Numbers, boolean];

export { StrStrNumNumBool };
