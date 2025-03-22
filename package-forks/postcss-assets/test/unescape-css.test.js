const { test } = require("node:test");
const { expect } = require("expect");
const unescapeCss = require("../lib/unescape-css");

test("unescapes plain chars", () => {
  expect(unescapeCss("Romeo \\+ Juliette")).toBe("Romeo + Juliette");
});

test("unescapes ASCII chars", () => {
  expect(unescapeCss("\\34\\32")).toBe("42");
});

test("unescapes Unicode chars", () => {
  expect(unescapeCss("I \\2665  NY")).toBe("I ♥ NY");
});
