import SomeLib from "somelibrary/thing/stuff";

import Component from "./Component";


export default class newStuff {
  constructor() {
    //eslint-disable-next-line no-console
    console.log("init class");
  }

  method() {
    //eslint-disable-next-line no-console
    console.log(Component, SomeLib);
  }
}
