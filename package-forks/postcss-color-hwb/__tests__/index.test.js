const { test } = require("node:test");
const { expect } = require("expect");
var fs = require("fs");

var postcss = require("postcss");
var plugin = require("..");

function filename(name) {
  return __dirname + "/" + name + ".css";
}

function read(name) {
  return fs.readFileSync(name, "utf8");
}

function compareFixtures(name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {};
  postcssOpts.from = filename("fixtures/" + name);
  opts = opts || {};

  return postcss([plugin(opts)])
    .process(read(postcssOpts.from), postcssOpts)
    .then((result) => {
      var expected = read(filename("fixtures/" + name + ".expected"));
      const actual = result.css;
      expect(actual).toEqual(expected);
    });
}

test("hwb", () => {
  return compareFixtures("hwb", "should transform hwb");
});

test("hwb Colors Level 4", () => {
  return compareFixtures("hwb-4", "should transform hwb");
});
