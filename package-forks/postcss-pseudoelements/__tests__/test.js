const test = require("ava");
var postcss = require("postcss");
var fs = require("fs");
var pseudoelements = require("../index.js");

test("should default to one colon per pseudo element", function(t) {
  var input = fs.readFileSync(__dirname + "/input.css", "utf-8");
  var expected = fs.readFileSync(__dirname + "/expected-single.css", "utf-8");

  var out = postcss(pseudoelements()).process(input);

  t.deepEqual(out.css, expected);
});

test("should default to two colons per pseudo element", function(t) {
  var input = fs.readFileSync(__dirname + "/input.css", "utf-8");
  var expected = fs.readFileSync(__dirname + "/expected-double.css", "utf-8");
  var options = {
    single: false,
  };

  var out = postcss(pseudoelements(options)).process(input);

  t.deepEqual(out.css, expected);
});
