/* eslint quotes: 0 */

const { test } = require("node:test");
const { expect } = require("expect");
const unquote = require("../lib/unquote");

test("removes quotes", () => {
  expect(unquote('"foo"')).toBe("foo");
  expect(unquote("'bar'")).toBe("bar");
});

test("preserves unquoted strings", () => {
  expect(unquote("foo")).toBe("foo");
});
