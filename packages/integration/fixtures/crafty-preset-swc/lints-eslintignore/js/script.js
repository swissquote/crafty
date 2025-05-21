/* global test */
import Component from  "./Component.js";

function test() {
  let sum = 0,
    i;

  for (i = 0; i < 10; i++) {
    if (i >= 5) {
      continue;
    }

    sum += i;
  }

  return sum;
}

export default class newStuff {
  constructor() {
    console.log("init class");
  }

  method() {
    console.log(  "some method" , Component);
  }

  isEqual(a, b)
  {
    return a == b;
  }
}
