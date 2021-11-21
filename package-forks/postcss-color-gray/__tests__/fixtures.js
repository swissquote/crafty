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

function testFixture(name, pluginOpts = {}, postcssOpts = {}) {
  postcssOpts.from = fixturePath(name);
  let expected = readFixture(`${name}.expect`);
  return postcss([plugin(pluginOpts)])
    .process(readFixture(name), postcssOpts)
    .then((result) => {
      expect(result.css).toEqual(expected);
      expect(result.warnings().length).toEqual(0);
    });
}

it("Transforms gray()", () => {
  return testFixture("basic");
});

it("Transforms gray(), preserve original", () => {
  return testFixture("basic-preserve", { preserve: true });
});
