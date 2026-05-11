test("loads JSX tests through the Babel preset hook", () => {
  expect(__BABEL_MAGIC__).toBe("babel-hooked");
});