
import {test} from "./Component";

export default class NewStuff {
  constructor() {
    // tslint:disable-next-line no-console
    console.log("init class");
  }

  method() {
    // tslint:disable-next-line no-console
    console.log(test(2, 4));

    import("./SomeLibrary").then((SomeLibrary) => {
      const som = new SomeLibrary.default();

      // tslint:disable-next-line no-console
      console.log(som.add(2, 4));
    });
  }
}
