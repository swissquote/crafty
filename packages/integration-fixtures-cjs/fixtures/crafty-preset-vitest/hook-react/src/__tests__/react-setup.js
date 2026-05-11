test("loads the React setup file through the preset hook", () => {
  expect(globalThis.IS_REACT_ACT_ENVIRONMENT).toBe(true);
  expect(typeof globalThis.requestAnimationFrame).toBe("function");
});