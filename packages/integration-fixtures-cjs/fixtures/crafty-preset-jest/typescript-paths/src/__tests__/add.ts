import { add } from "@math/add";

it("adds two numbers through a tsconfig path alias", () => {
  expect(add(2, 2)).toEqual(4);
});
