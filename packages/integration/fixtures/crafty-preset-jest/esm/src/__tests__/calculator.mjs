import { it } from "@jest/globals";
import { doSomeMath } from "../calculator.mjs";
import { add } from "../math.mjs";

it("adds two numbers", () => {
    expect(add(2,2)).toEqual(4);
});

it("advanced math", () => {
    expect(doSomeMath()).toEqual(6);
});