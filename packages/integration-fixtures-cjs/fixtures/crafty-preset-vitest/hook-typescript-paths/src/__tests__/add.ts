import { add } from "@math/add";

test("resolves TypeScript imports through a tsconfig path alias", () => {
  expect(add(5, 6)).toBe(11);
});
