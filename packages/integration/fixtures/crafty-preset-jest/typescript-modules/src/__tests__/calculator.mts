import { doSomeMath } from "../calculator.mjs";

it("advanced math", () => {
    expect(doSomeMath()).toEqual(6);
});