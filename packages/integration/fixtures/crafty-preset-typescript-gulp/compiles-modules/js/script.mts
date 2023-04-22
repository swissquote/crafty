import test from "./Component.mjs";

export default class NewStuff {
  constructor() {
    // eslint-disable-next-line no-console
    console.log("init class");
  }

  method() {
    // eslint-disable-next-line no-console
    console.log(test(2, 4));

    import("./SomeLibrary.mjs").then(SomeLibrary => {
      const som = new SomeLibrary.default();

      // eslint-disable-next-line no-console
      console.log(som.add(2, 4));
    });
  }
}