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

function compareFixtures(t, name, opts, postcssOpts) {
  postcssOpts = postcssOpts || {};
  postcssOpts.from = filename("fixtures/" + name);
  opts = opts || {};
  return postcss()
    .use(plugin(opts))
    .process(read(postcssOpts.from), postcssOpts)
    .then((result) => {
      var expected = read(filename("fixtures/" + name + ".expected"));
      t.deepEqual(result.css, expected);
      t.is(result.warnings().length, 0);
    });
}

test("should transform rgba", (t) => {
  return compareFixtures(t, "rgba-fallback");
});

test("should transform rgba 2", (t) => {
  return compareFixtures(t, "rgba-double-fallback");
});

test("should not transform rgba", (t) => {
  return compareFixtures(t, "no-rgba-fallback");
});

test("should transform rgba in shadow", (t) => {
  return compareFixtures(t, "rgba-fallback-option", {
    properties: ["box-shadow"],
  });
});

test("should transform background", (t) => {
  return compareFixtures(t, "rgba-background-fallback", {
    backgroundColor: [255, 255, 255],
  });
});

test("should add old IE filters", (t) => {
  return compareFixtures(t, "rgba-oldie-fallback", {
    oldie: true,
  });
});
