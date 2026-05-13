test("ignores the native JavaScript Vitest config", () => {
  expect(globalThis.__nativeConfigLoaded).toBeUndefined();
});