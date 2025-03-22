const { test } = require("node:test");
const { expect } = require("expect");

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
      "file1.ext1": mock.file({
        content: "file1 content",
        mtime: new Date(100)
      }),
      "file2.ext1": mock.file({
        content: "file2 content",
        mtime: new Date(100)
      }),
      dest: {
        "file1.ext2": mock.file({
          content: "file1 content",
          mtime: new Date(100)
        }),
        "file2.ext2": mock.file({
          content: "file2 content",
          mtime: new Date(50)
        })
      }
    });
  });
  test.afterEach(mock.restore);
  
  test("passes through one newer file", (t) => {
    return new Promise((done, fail) => {
      var stream = newer({
        dest: "dest",
        map(destPath) {
          return destPath.replace(".ext1", ".ext2");
        }
      });
  
      var paths = ["file1.ext1", "file2.ext1"];
  
      var calls = 0;
      stream.on("data", file => {
        expect(file.path).toEqual(path.resolve("file2.ext1"));
        ++calls;
      });
  
      stream.on("error", fail);
  
      stream.on("end", () => {
        expect(calls).toEqual(1);
        done();
      });
  
      write(stream, paths);
    });
  });
  
  test("allows people to join to dest themselves", (t) => {
    return new Promise((done, fail) => {
      var stream = newer({
        map(destPath) {
          return path.join("dest", destPath.replace(".ext1", ".ext2"));
        }
      });
  
      var paths = ["file1.ext1", "file2.ext1"];
  
      var calls = 0;
      stream.on("data", file => {
        expect(file.path).toEqual(path.resolve("file2.ext1"));
        ++calls;
      });
  
      stream.on("error", fail);
  
      stream.on("end", () => {
        expect(calls).toEqual(1);
        done();
      });
  
      write(stream, paths);
    });
  });
