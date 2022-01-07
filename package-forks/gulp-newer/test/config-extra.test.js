const test = require("ava");

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

test.before(() => {
    mock({
      main: mock.file({
        content: "main content",
        mtime: new Date(1)
      }),
      imported: mock.file({
        content: "2: other content, used by main",
        mtime: new Date(3)
      }),
      collected: mock.file({
        content: "main content\n1: other content, used by main",
        mtime: new Date(2)
      })
    });
  });
  test.after(mock.restore);
  
  test("must be a string or an array", (t) => {
    t.throws(() => {
      newer({ dest: "foo", extra: 1 });
    });
  
    t.throws(() => {
      newer({ dest: "foo", extra() {} });
    });
  
    /**t.notThrows(function() {
      newer({ dest: "foo", extra: "extra1" });
    });*/
  
    /*t.notThrows(function() {
      newer({ dest: "foo", extra: ["extra1", "extra2"] });
    });*/
  });
  
  test("must not throw on strings", (t) => {
    return new Promise((done, fail) => {
      var stream = newer({ dest: "foo", extra: "extra1" });
  
      var paths = ["main"];
  
      stream.on("data", file => {
        t.notDeepEqual(file.path, path.resolve("imported"));
      });
      stream.on("error", fail);
      stream.on("end", done);
  
      write(stream, paths);
    });
  });
  
  test("must not throw on arrays", (t) => {
    return new Promise((done, fail) => {
      var stream = newer({ dest: "foo", extra: ["extra1", "extra2"] });
  
      var paths = ["main"];
  
      stream.on("data", file => {
        t.notDeepEqual(file.path, path.resolve("imported"));
      });
      stream.on("error", fail);
      stream.on("end", done);
  
      write(stream, paths);
    });
  });
  
  test("must not be passed into stream", (t) => {
    return new Promise((done, fail) => {
      var stream = newer({ dest: "collected", extra: "imported" });
  
      var paths = ["main"];
  
      stream.on("data", file => {
        t.notDeepEqual(file.path, path.resolve("imported"));
      });
      stream.on("error", fail);
      stream.on("end", () => {
          done(); 
        
        });
  
      write(stream, paths);
    });
  });
  
  test('must let other files through stream if an "extra" is newer', (t) => {
    return new Promise((done, fail) => {
      var stream = newer({ dest: "collected", extra: "imported" });
  
      var paths = ["main"];
  
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