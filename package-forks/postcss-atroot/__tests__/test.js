const { test } = require("node:test");
const { expect } = require("expect");
var postcss = require("postcss");
var atroot = require("../");

function runTest(input, output, opts) {
  var result = postcss(atroot(opts)).process(input);
  expect(result.css).toEqual(output);
  expect(result.warnings().length).toBe(0);
}

test("places nodes before parent rule", function() {
  runTest(
    ".test {@at-root {.root {color: black}}}",
    ".root {color: black}\n.test {}"
  );
});

test("places nodes before parent rule, recursively", function() {
  runTest(
    ".test { .innertest { @at-root {.root {color: black}}}}",
    ".root {color: black} .test { .innertest {}}"
  );
});

test("places nodes before parent rule, keeps nested media", function() {
  runTest(
    ".test { .innertest { @at-root { @media(print) {.root {color: black}}}}}",
    " @media(print) {.root {color: black}}.test { .innertest {}}"
  );
});

test("saves nodes order", function() {
  runTest(
    ".test { color:blue; @at-root { .innerTest { color: white;"
    + "color: black;color: green }  } background: orange; }",
    " .innerTest { color: white;color: black;color: green }\n"
    + ".test { color:blue; background: orange; }"
  );
});
