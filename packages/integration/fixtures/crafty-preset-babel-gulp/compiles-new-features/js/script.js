/* global test */

import "./otherfile";

class Test {
  constructor(name) {
    this.name = name;
  }

  async sayHi() {
    //eslint-disable-next-line no-console
    console.log(`Hello ${this.name} !`);

    await Promise.resolve();
  }
}

const test = new Test("Stéphane");
test.sayHi();
