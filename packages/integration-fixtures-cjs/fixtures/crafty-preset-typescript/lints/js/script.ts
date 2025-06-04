
import {test } from "./Component";
import SomeLibrary from "./SomeLibrary";

export default class NewStuff {
    constructor () {
    console.log("init class");
 }

  method() {
    console.log( test( 2, 4));

    setTimeout( ( ) =>
    {
      const som = new SomeLibrary();

      console.log(som.add(2, 4));
    } , 300)
  }
}
