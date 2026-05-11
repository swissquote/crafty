test("loads the function-based Vitest config", () => {
  expect(globalThis.__nativeConfigLoaded).toBe("function");
});