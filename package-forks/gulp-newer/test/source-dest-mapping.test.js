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
  
  test("passes through one newer file", () => {
    return new Promise((done, fail) => {
      const stream = newer({
        dest: "dest",
        map(destPath) {
          return destPath.replace(".ext1", ".ext2");
        }
      });
  
      const paths = ["file1.ext1", "file2.ext1"];
  
      let calls = 0;
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
  
  test("allows people to join to dest themselves", () => {
    return new Promise((done, fail) => {
      const stream = newer({
        map(destPath) {
          return path.join("dest", destPath.replace(".ext1", ".ext2"));
        }
      });
  
      const paths = ["file1.ext1", "file2.ext1"];
  
      let calls = 0;
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
