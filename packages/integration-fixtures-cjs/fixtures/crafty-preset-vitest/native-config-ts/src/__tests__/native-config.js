test("ignores the native TypeScript Vitest config", () => {
  expect(globalThis.__nativeConfigLoaded).toBeUndefined();
});