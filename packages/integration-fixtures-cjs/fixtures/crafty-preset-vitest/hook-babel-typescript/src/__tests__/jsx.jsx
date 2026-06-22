import { multiply } from "../typed-helper";

test("loads JSX tests through mixed Babel and TypeScript preset hooks", () => {
  expect(__BABEL_MAGIC__).toBe("babel-hooked");
  expect(multiply(2, 4)).toBe(8);
});