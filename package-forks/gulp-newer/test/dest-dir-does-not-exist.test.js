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
      source1: "source1 content",
      source2: "source2 content",
      source3: "source3 content"
    });
  });
  test.afterEach(mock.restore);
  
  test("passes through all files", () => {
    return new Promise((done, fail) => {
      const stream = newer("new/dir");
  
      const paths = ["source1", "source2", "source3"];
  
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
