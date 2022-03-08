const test = require("ava");
var fs = require("fs");

var postcss = require("postcss");
var plugin = require("..");

function filename(name) {
  return __dirname + "/" + name + ".css";
}

function read(name) {
  return fs.readFileSync(name, "utf8");
}

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {};
  postcssOpts.from = filename("fixtures/" + name);
  opts = opts || {};

  return postcss([plugin(opts)])
    .process(read(postcssOpts.from), postcssOpts)
    .then((result) => {
      var expected = read(filename("fixtures/" + name + ".expected"));
      const actual = result.css;
      t.deepEqual(actual, expected);
    });
}

test("hwb", (t) => {
  return compareFixtures(t, "hwb", "should transform hwb");
});

test("hwb Colors Level 4", (t) => {
  return compareFixtures(t, "hwb-4", "should transform hwb");
});
