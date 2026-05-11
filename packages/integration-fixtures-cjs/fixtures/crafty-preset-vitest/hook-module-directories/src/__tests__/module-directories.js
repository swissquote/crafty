const sharedValue = require("shared-value");

test("resolves modules from custom module directories", () => {
  expect(sharedValue).toBe("from test_modules");
});