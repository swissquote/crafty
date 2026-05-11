const add = require("../math");

test("it adds larger numbers", () => {
  expect(add(10, 20)).toBe(30);
});
