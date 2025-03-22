const { test } = require("node:test");
const { expect } = require("expect");

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

test.beforeEach(() => {
    mock({
      source1: "source1 content",
      source2: "source2 content",
      source3: "source3 content"
    });
  });
  test.afterEach(mock.restore);
  
  test("passes through all files", () => {
    return new Promise((done, fail) => {
      var stream = newer("new/dir");
  
      var paths = ["source1", "source2", "source3"];
  
      var calls = 0;
      stream.on("data", file => {
        expect(file.path).toEqual(path.resolve(paths[calls]));
        ++calls;
      });
  
      stream.on("error", fail);
  
      stream.on("end", () => {
        expect(calls).toEqual(paths.length);
        done();
      });
  
      write(stream, paths);
    });
  });
