test("loads the native TypeScript Vitest config", () => {
  expect(globalThis.__nativeConfigLoaded).toBe("ts");
});