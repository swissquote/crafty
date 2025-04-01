const { expect } = require("expect");
const { test } = require("node:test");

const Assets = require("..");

test("constructor", () => {
  expect(typeof Assets).toBe("function");
  // eslint-disable-next-line new-cap
  expect(new Assets()).toBeInstanceOf(Assets);
  expect(Object.isFrozen(new Assets())).toBe(true);
});

test(".options", () => {
  const options = { basePath: "source" };
  expect(new Assets().options).toEqual({});
  expect(new Assets(options).options.basePath).toBe("source");
  expect(new Assets(options).options).not.toBe(options);
});
