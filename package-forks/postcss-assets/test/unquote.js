/* eslint quotes: 0 */

const { test } = require("uvu");
const assert = require("uvu/assert");
const unquote = require("../lib/unquote");

test("removes quotes", () => {
  assert.is(unquote('"foo"'), "foo");
  assert.is(unquote("'bar'"), "bar");
});

test("preserves unquoted strings", () => {
  assert.is(unquote("foo"), "foo");
});

test.run();
