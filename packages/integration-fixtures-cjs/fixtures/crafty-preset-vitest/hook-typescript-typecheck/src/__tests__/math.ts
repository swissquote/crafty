import { add } from "../math";

test("type-checks TypeScript tests through tsconfig.test.json", () => {
  expect(add(5, 6)).toBe(11);
});
