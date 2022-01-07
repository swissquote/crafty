// reports errors

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
      q: mock.file({
        mtime: new Date(100)
      }),
      dest: {}
    });
  });
  test.afterEach(mock.restore);
  
  test('in "data" handlers', (t) => {
    return new Promise(done => {
      var stream = newer("dest");
  
      var err = new Error("test");
  
      stream.on("data", () => {
        throw err;
      });
  
      stream.on("error", caught => {
        t.deepEqual(caught, err);
        done();
      });
  
      write(stream, ["q"]);
    });
  });