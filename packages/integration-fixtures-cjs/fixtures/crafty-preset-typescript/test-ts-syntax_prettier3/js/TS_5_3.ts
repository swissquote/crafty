//https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html#import-attributes
import obj from "./ts_4_5.json" with { type: "json" };

export function getJson() {
  return obj;
}
