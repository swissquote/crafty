const add = require("lodash-es/add").default;

it("adds two numbers", () => {
  expect(add(2, 2)).toEqual(4);
});
