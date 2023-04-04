// TODO :: unsupported by SWC
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#import-assertions
//import obj from "./ts_4_5.json" assert { type: "json" };
//
//export { obj };

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#type-modifiers-on-import-names
export interface SomeType {
  getData(): string;
}

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#private-field-presence-checks
export class Person {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  equals(other: unknown) {
    return (
      other &&
      typeof other === "object" &&
      #name in other && // <- this is new!
      this.#name === other.#name
    );
  }
}
