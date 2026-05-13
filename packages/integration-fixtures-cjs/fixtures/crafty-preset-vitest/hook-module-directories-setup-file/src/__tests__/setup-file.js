test("loads the user setup file after module resolution is installed", () => {
  expect(globalThis.__setupSharedValue).toBe("from test_modules");
});