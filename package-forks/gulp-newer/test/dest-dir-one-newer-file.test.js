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
      file1: mock.file({
        content: "file1 content",
        mtime: new Date(100)
      }),
      file2: mock.file({
        content: "file2 content",
        mtime: new Date(100)
      }),
      file3: mock.file({
        content: "file3 content",
        mtime: new Date(100)
      }),
      dest: {
        file2: mock.file({
          content: "file2 content",
          mtime: new Date(200)
        })
      }
    });
  });
  test.afterEach(mock.restore);
  
  test("passes through two newer files", () => {
    return new Promise((done, fail) => {
      var stream = newer("dest");
  
      var paths = ["file1", "file2", "file3"];
  
      var calls = 0;
      stream.on("data", file => {
        expect(file.path).not.toBe(path.resolve("file2"));
        ++calls;
      });
  
      stream.on("error", fail);
  
      stream.on("end", () => {
        expect(calls).toBe(paths.length - 1);
        done();
      });
  
      write(stream, paths);
    });
  });
