import { add } from "../math.mjs";

it("adds two numbers", () => {
    expect(add(2,2)).toEqual(4);
});