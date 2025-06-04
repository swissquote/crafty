// Typescript 4.0
// Tuple types improvements
type Strings = [string, string];
type Numbers = [number, number];
type StrStrNumNumBool = [...Strings, ...Numbers, boolean];

export { StrStrNumNumBool };

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
