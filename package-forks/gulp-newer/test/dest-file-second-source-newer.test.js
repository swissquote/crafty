const { test } = require("node:test");
const { expect } = require("expect");

const fs = require("node:fs");
const path = require("node:path");

const Vinyl = require("vinyl");
const mock = require("mock-fs");

const newer = require("../index.js");

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
        mtime: new Date(200)
      }),
      file3: mock.file({
        content: "file3 content",
        mtime: new Date(100)
      }),
      dest: {
        output: mock.file({
          content: "file2 content",
          mtime: new Date(150)
        })
      }
    });
  });
  test.afterEach(mock.restore);
  
  test("passes through all source files", () => {
    return new Promise((done, fail) => {
      const stream = newer("dest/output");
  
      const paths = ["file1", "file2", "file3"];
  
      let calls = 0;
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
