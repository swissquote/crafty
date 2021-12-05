/* eslint-disable @swissquote/swissquote/sonarjs/no-duplicate-string,@swissquote/swissquote/sonarjs/no-identical-functions */

const { suite } = require("uvu");
const assert = require("uvu/assert");

var Transform = require("stream").Transform;
var fs = require("fs");
var path = require("path");

var Vinyl = require("vinyl");
var mock = require("mock-fs");

var newer = require("./index.js");

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

const it = suite("newer()");

it("creates a transform stream", () => {
  var stream = newer("foo");
  assert.instance(stream, Transform);
});

it("requires a string dest or an object with the dest property", () => {
  assert.throws(() => {
    newer();
  });

  assert.throws(() => {
    newer(123);
  });

  assert.throws(() => {
    newer({});
  });
});

it("config.ext must be a string", () => {
  assert.throws(() => {
    newer({ dest: "foo", ext: 1 });
  });

  assert.throws(() => {
    newer({ dest: "foo", ext: {} });
  });
});

it("config.map must be a function", () => {
  assert.throws(() => {
    newer({ dest: "foo", map: 1 });
  });

  assert.throws(() => {
    newer({ dest: "foo", map: "bar" });
  });
});

it("config.map makes the dest config optional", () => {
  assert.not.throws(() => {
    newer({ map() {} });
  });
});

it.run();

const it2 = suite("config.extra");

it2.before.each(() => {
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
it2.after.each(mock.restore);

it2("must be a string or an array", () => {
  assert.throws(() => {
    newer({ dest: "foo", extra: 1 });
  });

  assert.throws(() => {
    newer({ dest: "foo", extra() {} });
  });

  /**assert.not.throws(function() {
    newer({ dest: "foo", extra: "extra1" });
  });*/

  /*assert.not.throws(function() {
    newer({ dest: "foo", extra: ["extra1", "extra2"] });
  });*/
});

it2("must not throw on strings", () => {
  return new Promise((done, fail) => {
    var stream = newer({ dest: "foo", extra: "extra1" });

    var paths = ["main"];

    stream.on("data", file => {
      assert.not.equal(file.path, path.resolve("imported"));
    });
    stream.on("error", fail);
    stream.on("end", done);

    write(stream, paths);
  });
});

it2("must not throw on arrays", () => {
  return new Promise((done, fail) => {
    var stream = newer({ dest: "foo", extra: ["extra1", "extra2"] });

    var paths = ["main"];

    stream.on("data", file => {
      assert.not.equal(file.path, path.resolve("imported"));
    });
    stream.on("error", fail);
    stream.on("end", done);

    write(stream, paths);
  });
});

it2("must not be passed into stream", () => {
  return new Promise((done, fail) => {
    var stream = newer({ dest: "collected", extra: "imported" });

    var paths = ["main"];

    stream.on("data", file => {
      assert.not.equal(file.path, path.resolve("imported"));
    });
    stream.on("error", fail);
    stream.on("end", done);

    write(stream, paths);
  });
});

it2('must let other files through stream if an "extra" is newer', () => {
  return new Promise((done, fail) => {
    var stream = newer({ dest: "collected", extra: "imported" });

    var paths = ["main"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it2.run();

const it3 = suite("dest dir that does not exist");

it3.before.each(() => {
  mock({
    source1: "source1 content",
    source2: "source2 content",
    source3: "source3 content"
  });
});
it3.after.each(mock.restore);

it3("passes through all files", () => {
  return new Promise((done, fail) => {
    var stream = newer("new/dir");

    var paths = ["source1", "source2", "source3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it3.run();

const it4 = suite("dest file that does not exist");

it4.before.each(() => {
  mock({
    file1: "file1 content",
    file2: "file2 content",
    file3: "file3 content",
    dest: {}
  });
});
it4.after.each(mock.restore);

it4("passes through all files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest/concat");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it4.run();

const it5 = suite("empty dest dir");

it5.before.each(() => {
  mock({
    source1: "source1 content",
    source2: "source2 content",
    source3: "source3 content",
    dest: {}
  });
});
it5.after.each(mock.restore);

it5("passes through all files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest");

    var paths = ["source1", "source2", "source3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it5.run();

const it6 = suite("dest dir with one older file");

it6.before.each(() => {
  mock({
    file1: "file1 content",
    file2: "file2 content",
    file3: "file3 content",
    dest: {
      file2: mock.file({
        content: "file2 content",
        mtime: new Date(1)
      })
    }
  });
});
it6.after.each(mock.restore);

it6("passes through all files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it6.run();

const it7 = suite("dest dir with one newer file");

it7.before.each(() => {
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
it7.after.each(mock.restore);

it7("passes through two newer files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.not.equal(file.path, path.resolve("file2"));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length - 1);
      done();
    });

    write(stream, paths);
  });
});
it7.run();

const it8 = suite("dest dir with two newer and one older file");

it8.before.each(() => {
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
      file1: mock.file({
        content: "file1 content",
        mtime: new Date(150)
      }),
      file2: mock.file({
        content: "file2 content",
        mtime: new Date(50)
      }),
      file3: mock.file({
        content: "file3 content",
        mtime: new Date(150)
      })
    }
  });
});
it8.after.each(mock.restore);

it8("passes through one newer file", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve("file2"));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, 1);
      done();
    });

    write(stream, paths);
  });
});
it8.run();

const it9 = suite("dest file with first source file newer");

it9.before.each(() => {
  mock({
    file1: mock.file({
      content: "file1 content",
      mtime: new Date(200)
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
      output: mock.file({
        content: "file2 content",
        mtime: new Date(150)
      })
    }
  });
});
it9.after.each(mock.restore);

it9("passes through all source files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest/output");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it9.run();

const it10 = suite("dest file with second source file newer");

it10.before.each(() => {
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
it10.after.each(mock.restore);

it10("passes through all source files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest/output");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it10.run();

const it11 = suite("dest file with last source file newer");

it11.before.each(() => {
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
      mtime: new Date(200)
    }),
    dest: {
      output: mock.file({
        content: "file2 content",
        mtime: new Date(150)
      })
    }
  });
});
it11.after.each(mock.restore);

it11("passes through all source files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest/output");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve(paths[calls]));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, paths.length);
      done();
    });

    write(stream, paths);
  });
});

it11.run();

const it12 = suite("dest file with no newer source files");

it12.before.each(() => {
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
      output: mock.file({
        content: "file2 content",
        mtime: new Date(150)
      })
    }
  });
});
it12.after.each(mock.restore);

it12("passes through no source files", () => {
  return new Promise((done, fail) => {
    var stream = newer("dest/output");

    var paths = ["file1", "file2", "file3"];

    var calls = 0;
    stream.on("data", () => {
      fail(new Error("Expected no source files"));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, 0);
      done();
    });

    write(stream, paths);
  });
});

it12.run();

const it13 = suite("dest file ext and two files");

it13.before.each(() => {
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
it13.after.each(mock.restore);

it13("passes through one newer file", () => {
  return new Promise((done, fail) => {
    var stream = newer({ dest: "dest", ext: ".ext2" });

    var paths = ["file1.ext1", "file2.ext1"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve("file2.ext1"));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, 1);
      done();
    });

    write(stream, paths);
  });
});

it13.run();

const it14 = suite("custom mapping between source and dest");

it14.before.each(() => {
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
it14.after.each(mock.restore);

it14("passes through one newer file", () => {
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
      assert.equal(file.path, path.resolve("file2.ext1"));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, 1);
      done();
    });

    write(stream, paths);
  });
});

it14("allows people to join to dest themselves", () => {
  return new Promise((done, fail) => {
    var stream = newer({
      map(destPath) {
        return path.join("dest", destPath.replace(".ext1", ".ext2"));
      }
    });

    var paths = ["file1.ext1", "file2.ext1"];

    var calls = 0;
    stream.on("data", file => {
      assert.equal(file.path, path.resolve("file2.ext1"));
      ++calls;
    });

    stream.on("error", fail);

    stream.on("end", () => {
      assert.equal(calls, 1);
      done();
    });

    write(stream, paths);
  });
});

it14.run();

const it15 = suite("reports errors");
it15.before.each(() => {
  mock({
    q: mock.file({
      mtime: new Date(100)
    }),
    dest: {}
  });
});
it15.after.each(mock.restore);

it15('in "data" handlers', () => {
  return new Promise(done => {
    var stream = newer("dest");

    var err = new Error("test");

    stream.on("data", () => {
      throw err;
    });

    stream.on("error", caught => {
      assert.equal(caught, err);
      done();
    });

    write(stream, ["q"]);
  });
});

it15.run();
