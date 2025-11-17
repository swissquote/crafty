/* global test */

import Component from  "./Component.js";

function test (one,two) {
   return one + two;
}

export default class newStuff {
  constructor() {
    console.log("init class");
  }

  method () {
    console.log(  "some method" , Component);
  }

  isEqual( a, b)
  {
    return a == b;
  }
}
