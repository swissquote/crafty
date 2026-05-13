import { test } from "node:test";
import { expect } from "expect";
import unescapeCss from "../lib/unescape-css.js";

test("unescapes plain chars", () => {
  expect(unescapeCss("Romeo \\+ Juliette")).toBe("Romeo + Juliette");
});

test("unescapes ASCII chars", () => {
  expect(unescapeCss("\\34\\32")).toBe("42");
});

test("unescapes Unicode chars", () => {
  expect(unescapeCss("I \\2665  NY")).toBe("I ♥ NY");
});
