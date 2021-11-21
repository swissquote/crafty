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

it("Transforms hsl()", () => {
  return testFixture("hsl");
});

it("Transforms hsl() using new comma-separated syntax", () => {
  return testFixture("alternative-syntax");
});

it("Actual hsl() is not affected", () => {
  return testFixture("actual-syntax");
});
