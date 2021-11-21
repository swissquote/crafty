var fs = require("fs");

var postcss = require("postcss");
var plugin = require("..");

function filename(name) {
  return __dirname + "/" + name + ".css";
}
function read(name) {
  return fs.readFileSync(name, "utf8");
}

function compareFixtures(name, opts, postcssOpts) {
  postcssOpts = postcssOpts || {};
  postcssOpts.from = filename("fixtures/" + name);
  opts = opts || {};
  return postcss()
    .use(plugin(opts))
    .process(read(postcssOpts.from), postcssOpts)
    .then((result) => {
      var expected = read(filename("fixtures/" + name + ".expected"));
      expect(result.css).toEqual(expected);
      expect(result.warnings().length).toEqual(0);
    });
}

it("should transform rgba", () => {
  return compareFixtures("rgba-fallback");
});

it("should transform rgba", () => {
  return compareFixtures("rgba-double-fallback");
});

it("should not transform rgba", () => {
  return compareFixtures("no-rgba-fallback");
});

it("should transform rgba in shadow", () => {
  return compareFixtures("rgba-fallback-option", {
    properties: ["box-shadow"],
  });
});

it("should transform background", () => {
  return compareFixtures("rgba-background-fallback", {
    backgroundColor: [255, 255, 255],
  });
});

it("should add old IE filters", () => {
  return compareFixtures("rgba-oldie-fallback", {
    oldie: true,
  });
});
