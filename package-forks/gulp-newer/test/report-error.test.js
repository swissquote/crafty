const { test } = require('node:test');
const { expect } = require('expect');

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
      q: mock.file({
        mtime: new Date(100)
      }),
      dest: {}
    });
  });
  test.afterEach(mock.restore);
  
  test('in "data" handlers', () => {
    return new Promise(done => {
      const stream = newer("dest");
  
      const err = new Error("test");
  
      stream.on("data", () => {
        throw err;
      });
  
      stream.on("error", caught => {
        expect(caught).toEqual(err);
        done();
      });
  
      write(stream, ["q"]);
    });
  });
