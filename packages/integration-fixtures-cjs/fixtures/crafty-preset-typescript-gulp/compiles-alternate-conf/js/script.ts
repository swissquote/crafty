import Loading from "./Loading";

export default class NewStuff {
  constructor() {
    // eslint-disable-next-line no-console
    console.log("init class");
  }

  method() {
    // eslint-disable-next-line no-console
    console.log(Loading);

    import("./SomeLibrary").then(SomeLibrary => {
      const som = new SomeLibrary.default();

      // eslint-disable-next-line no-console
      console.log(som.add(2, 4));
    });
  }
}
