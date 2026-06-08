import { multiply, stringifyMessage } from "../typed-helper";

test("loads TypeScript tests through mixed Babel and TypeScript preset hooks", () => {
  expect(multiply(5, 6)).toBe(30);
  expect(stringifyMessage("works")).toBe("works");
});