const test = require("ava");
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const plugin = require("../");

function fixturePath(name) {
  return path.join(__dirname, "fixtures", `${name}.css`);
}

function readFixture(name) {
  return fs.readFileSync(fixturePath(name), "utf8");
}

function testFixture(t,name, pluginOpts = {}, postcssOpts = {}) {
  postcssOpts.from = fixturePath(name);
  let expected = readFixture(`${name}.expect`);
  return postcss([plugin(pluginOpts)])
    .process(readFixture(name), postcssOpts)
    .then((result) => {
      t.deepEqual(result.css, expected);
      t.is(result.warnings().length, 0);
    });
}

test("Transforms gray()", (t) => {
  return testFixture(t,"basic");
});

test("Transforms gray(), preserve original", (t) => {
  return testFixture(t,"basic-preserve", { preserve: true });
});
