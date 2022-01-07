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

test.beforeEach(() => {
    mock({
      source1: "source1 content",
      source2: "source2 content",
      source3: "source3 content",
      dest: {}
    });
  });
  test.afterEach(mock.restore);
  
  test("passes through all files", (t) => {
    return new Promise((done, fail) => {
      var stream = newer("dest");
  
      var paths = ["source1", "source2", "source3"];
  
      var calls = 0;
      stream.on("data", file => {
        t.deepEqual(file.path, path.resolve(paths[calls]));
        ++calls;
      });
  
      stream.on("error", fail);
  
      stream.on("end", () => {
        t.deepEqual(calls, paths.length);
        done();
      });
  
      write(stream, paths);
    });
  });