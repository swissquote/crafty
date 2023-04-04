// mts / cts : https://github.com/rollup/plugins/pull/1454
import { helper } from "./TS_4_7_common.cjs";

export { helper };

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#instantiation-expressions
// TODO : SWC can't parse this
//function makeBox<T>(value: T) {
//  return { value };
//}
//
//const makeStringBox = makeBox<string>;
//const makeNumberBox = makeBox<number>;
//
//export { makeStringBox, makeNumberBox };
