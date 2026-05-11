import { add } from "../math";

test("loads TypeScript tests through the preset hook", () => {
  expect(add(5, 6)).toBe(11);
});