const sharedValue = require("shared-value");

test("resolves modules from nested custom module directories", () => {
  expect(sharedValue).toBe("from nested test_modules");
});