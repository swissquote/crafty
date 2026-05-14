test("loads the user setup file after module resolution is installed", () => {
  expect(globalThis.__setupSharedValue).toBe("from test_modules");
  expect(globalThis.__setupSharedValueResolved.replace(/\\/g, "/")).toContain(
    "/test_modules/shared-value/index.js"
  );
});