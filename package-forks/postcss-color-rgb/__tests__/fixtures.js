const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const plugin = require("../src");

function fixturePath(name) {
  return path.join(__dirname, "fixtures", `${name}.css`);
}

function readFixture(name) {
  return fs.readFileSync(fixturePath(name), "utf8");
}

function testFixture(name, pluginOpts = {}, postcssOpts = {}) {
  postcssOpts.from = fixturePath(name);
  const expected = readFixture(`${name}.expected`);
  return postcss([plugin(pluginOpts)])
    .process(readFixture(name), postcssOpts)
    .then(result => {
      expect(result.css).toEqual(expected);
      expect(result.warnings().length).toEqual(0);
    });
}

test("Transforms rgb() with RGB range 0-255 input", () => {
  return testFixture("rgb-0-255");
});

test("Transforms rgb() with percentage input", () => {
  return testFixture("rgb-percentage");
});

test("Transforms rgb() with number input instead of integer", () => {
  return testFixture("rgb-number-to-integer");
});

test("Transforms rgb() using new comma-separated syntax", () => {
  return testFixture("alternative-syntax");
});

test("Actual rgb() is not affected", () => {
  return testFixture("actual-syntax");
});

test("Wrong rgb() does not stop the plugin", () => {
  return testFixture("wrong-written");
});
