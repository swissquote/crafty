import Component from "./Component";
import OtherComponent from "./OtherComponent";

export default class newStuff {
  constructor() {
    //eslint-disable-next-line no-console
    console.log("init class");
  }

  method() {
    //eslint-disable-next-line no-console
    console.log(Component, OtherComponent);
  }
}
