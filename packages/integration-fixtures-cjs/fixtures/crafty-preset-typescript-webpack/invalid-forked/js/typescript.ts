export class C {
    constructor() {
        console.log("Something happens here");

        new D().someNonExistingMethod();
    }

    someMethod() {
        alert("yes, alert still exists");
    }
}

export class D {
    constructor() {
        console.log("Something else happens here");
    }

    someMethod() {
        alert("yes, alert still exists");
    }
}
