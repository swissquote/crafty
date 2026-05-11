test("loads the native JavaScript Vitest config", () => {
  expect(globalThis.__nativeConfigLoaded).toBe("js");
});