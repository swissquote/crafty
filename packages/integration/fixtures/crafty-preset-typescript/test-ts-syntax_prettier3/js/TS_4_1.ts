// TypeScript 4.1
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types
type Color = "red" | "blue";
type Quantity = "one" | "two";
type SeussFish = `${Quantity | Color} fish`;

export { SeussFish };

// TypeScript 4.1
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
type MappedTypeWithNewKeys<T, NewType extends string> = {
  [K in keyof T as NewType]: T[K];
};

export { MappedTypeWithNewKeys };
