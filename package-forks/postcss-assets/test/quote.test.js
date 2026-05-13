/* eslint quotes: 0 */

import { test } from "node:test";
import { expect } from "expect";
import quote from "../lib/quote.js";

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
