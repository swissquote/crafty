/* eslint quotes: 0 */

const { test } = require("uvu");
const assert = require("uvu/assert");
const quote = require("../lib/quote");

test("adds quotes", () => {
  assert.is(quote("foo"), "'foo'");
});

test("preserves quoted strings", () => {
  assert.is(quote("'foo'"), "'foo'");
  assert.is(quote('"foo"'), '"foo"');
});

test("escapes inner quotes", () => {
  assert.is(quote("foo'bar'baz"), "'foo\\'bar\\'baz'");
});

test("preserves already escaped quotes", () => {
  assert.is(quote("foo\\'bar\\'baz"), "'foo\\'bar\\'baz'");
});

test.run();
