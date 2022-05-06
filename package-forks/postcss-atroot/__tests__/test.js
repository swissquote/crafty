const test = require("ava");
var postcss = require("postcss");
var atroot = require("../");

function runTest(t, input, output, opts) {
  var result = postcss(atroot(opts)).process(input);
  t.deepEqual(result.css, output);
  t.is(result.warnings().length, 0);
}

test("places nodes before parent rule", function(t) {
  runTest(
    t,
    ".test {@at-root {.root {color: black}}}",
    ".root {color: black}\n.test {}"
  );
});

test("places nodes before parent rule, recursively", function(t) {
  runTest(
    t,
    ".test { .innertest { @at-root {.root {color: black}}}}",
    ".root {color: black} .test { .innertest {}}"
  );
});

test("places nodes before parent rule, keeps nested media", function(t) {
  runTest(
    t,
    ".test { .innertest { @at-root { @media(print) {.root {color: black}}}}}",
    " @media(print) {.root {color: black}}.test { .innertest {}}"
  );
});

test("saves nodes order", function(t) {
  runTest(
    t,
    ".test {@at-root {color: white;color: black;color: green}}",
    "color: white;color: black;color: green;\n.test {}"
  );
});
