/* eslint quotes: 0 */

const { test } = require("node:test");
const { expect } = require("expect");
const quote = require("../lib/quote");

test("adds quotes", () => {
  expect(quote("foo")).toBe("'foo'");
});

test("preserves quoted strings", () => {
  expect(quote("'foo'")).toBe("'foo'");
  expect(quote('"foo"')).toBe('"foo"');
});

test("escapes inner quotes", () => {
  expect(quote("foo'bar'baz")).toBe("'foo\\'bar\\'baz'");
});

test("preserves already escaped quotes", () => {
  expect(quote("foo\\'bar\\'baz")).toBe("'foo\\'bar\\'baz'");
});
