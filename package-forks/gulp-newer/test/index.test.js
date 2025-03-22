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

test("creates a transform stream", () => {
  const stream = newer("foo");
  expect(stream).toBeInstanceOf(Transform);
});

test("requires a string dest or an object with the dest property", () => {
  expect(() => {
    newer();
  }).toThrow();

  expect(() => {
    newer(123);
  }).toThrow();

  expect(() => {
    newer({});
  }).toThrow();
});

test("config.ext must be a string", () => {
  expect(() => {
    newer({ dest: "foo", ext: 1 });
  }).toThrow();

  expect(() => {
    newer({ dest: "foo", ext: {} });
  }).toThrow();
});

test("config.map must be a function", () => {
  expect(() => {
    newer({ dest: "foo", map: 1 });
  }).toThrow();

  expect(() => {
    newer({ dest: "foo", map: "bar" });
  }).toThrow();
});

test("config.map makes the dest config optional", () => {
  expect(() => {
    newer({ map() {} });
  }).not.toThrow();
});
