export default class newStuff {
  constructor() {
    console.log("init class");
  }

  method() {
    import("./SomeClass").then(function(SomeClass) {
      const instance = new SomeClass.default("Bill");
      instance.sayHi();
    })
  }
}
