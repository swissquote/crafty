const test = require("ava");

var Transform = require("stream").Transform;
var fs = require("fs");
var path = require("path");

var Vinyl = require("vinyl");
var mock = require("mock-fs");

var newer = require("../index.js");

/**
 * Test utility function.  Create File instances for each of the provided paths
 * and write to the provided stream.  Call stream.end() when done.
 * @param {stream.Transform} stream Transform stream.
 * @param {Array.<string>} paths Array of file paths.
 */
function write(stream, paths) {
  paths.forEach(filePath => {
    stream.write(
      new Vinyl({
        contents: fs.readFileSync(filePath),
        path: path.resolve(filePath),
        stat: fs.statSync(filePath)
      })
    );
  });
  stream.end();
}

test("creates a transform stream", (t) => {
  var stream = newer("foo");
  t.truthy(stream instanceof Transform);
});

test("requires a string dest or an object with the dest property", (t) => {
  t.throws(() => {
    newer();
  });

  t.throws(() => {
    newer(123);
  });

  t.throws(() => {
    newer({});
  });
});

test("config.ext must be a string", (t) => {
  t.throws(() => {
    newer({ dest: "foo", ext: 1 });
  });

  t.throws(() => {
    newer({ dest: "foo", ext: {} });
  });
});

test("config.map must be a function", (t) => {
  t.throws(() => {
    newer({ dest: "foo", map: 1 });
  });

  t.throws(() => {
    newer({ dest: "foo", map: "bar" });
  });
});

test("config.map makes the dest config optional", (t) => {
  t.notThrows(() => {
    newer({ map() {} });
  });
});
