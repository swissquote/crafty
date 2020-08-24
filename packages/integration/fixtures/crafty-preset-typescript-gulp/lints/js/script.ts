
import {test } from "./Component";

export default class NewStuff {
    constructor () {
    console.log("init class");
 }

  method() {
    console.log( test( 2, 4));

    import("./SomeLibrary").then( SomeLibrary =>
    {
      const som = new SomeLibrary.default();

      console.log(som.add(2, 4));
    })
  }
}
