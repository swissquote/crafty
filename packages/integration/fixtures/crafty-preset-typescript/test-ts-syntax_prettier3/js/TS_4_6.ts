// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-6.html#allowing-code-in-constructors-before-super
function doSomeStuff() {
  // stuff
}

class Base {
  // ...
}

export class Derived extends Base {
  someProperty = true;
  constructor() {
    doSomeStuff();
    super();
  }
}
