test("loads JSX tests through mixed Babel and TypeScript preset hooks", () => {
  expect(__BABEL_MAGIC__).toBe("babel-hooked");
});