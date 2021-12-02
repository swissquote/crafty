const { test } = require("uvu");
const assert = require("uvu/assert");
const unescapeCss = require("../lib/unescape-css");

test("unescapes plain chars", () => {
  assert.is(unescapeCss("Romeo \\+ Juliette"), "Romeo + Juliette");
});

test("unescapes ASCII chars", () => {
  assert.is(unescapeCss("\\34\\32"), "42");
});

test("unescapes Unicode chars", () => {
  assert.is(unescapeCss("I \\2665  NY"), "I ♥ NY");
});

test.run();
