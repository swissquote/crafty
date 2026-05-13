test("ignores the function-based Vitest config", () => {
  expect(globalThis.__nativeConfigLoaded).toBeUndefined();
});