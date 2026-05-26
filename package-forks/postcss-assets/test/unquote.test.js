/* eslint quotes: 0 */

import { test } from "node:test";
import { expect } from "expect";
import unquote from "../lib/unquote.js";

test("removes quotes", () => {
  expect(unquote('"foo"')).toBe("foo");
  expect(unquote("'bar'")).toBe("bar");
});

test("preserves unquoted strings", () => {
  expect(unquote("foo")).toBe("foo");
});
