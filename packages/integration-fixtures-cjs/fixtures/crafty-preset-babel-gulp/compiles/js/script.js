/* global test */

import "./otherfile";

class Test {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    //eslint-disable-next-line no-console
    console.log(`Hello ${this.name} !`);
  }
}

const test = new Test("Stéphane");
test.sayHi();
