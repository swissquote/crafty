const concat = require("../");
const fs = require("fs/promises");
const path = require("path");
const { Transform } = require("node:stream");
const startStream = require("./test-stream");
const { test } = require("node:test");
const { expect } = require("expect");
const File = require("vinyl");
const vfs = require("vinyl-fs");
const sourcemap = require("vinyl-sourcemap");

function fixtures(glob) {
  return path.join(__dirname, "fixtures", glob);
};

var thirdBase = __dirname,
  thirdFile = "third.js",
  thirdPath = path.join(thirdBase, thirdFile);

function transform(fn) {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      (async function () {
        return fn(chunk);
      })().then(
        (newChunk) => callback(null, newChunk || chunk),
        (err) => callback(err)
      );
    },
  });
}

function assertNth(n, assertionCallback) {
  let i = 0;

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      if (i == n) {
        assertionCallback(chunk);
      } 
      i++;

      callback(null, chunk);
    },
  });
}

function assertFirst(assertionCallback) {
  return assertNth(0, assertionCallback);
}

function initSourceMap() {
  return new Transform({
    objectMode: true,
    transform(file, enc, callback) {
      sourcemap.add(file, (sourcemapErr, updatedFile) => {
        if (sourcemapErr) {
          return callback(sourcemapErr);
        }

        callback(null, updatedFile);
      });
    }
  })
}

// Create a third fixture, so we'll know it has the latest modified stamp.
// It must not live in the test/fixtures directory, otherwise the test
// 'should take path from latest file' will be meaningless.
test.before(async () => {
  await fs.writeFile(thirdPath, "console.log('third');\n");
});

// We'll delete it when we're done.
test.after(async () => {
  await fs.unlink(thirdPath);
});

test("should throw, when arguments is missing", function () {
  const error = expect(() => concat()).toThrow();
  expect(error.message).toBe("gulp-concat: Missing file option");
});

test("should ignore null files", function () {
  return new Promise((done) => {
    let count = 0;
    const stream = concat("test.js");
    stream.pipe(
      transform(() => {
        count++;
      })
    );
    stream.write(new File());
    stream.end();

    stream.on("finish", () => {
      expect(count).toBe(0);
      done();
    });
  });
});

// Somehow the error isn't propagated through the stream, unclear why
test.skip("should emit error on streamed file", () => {
  return new Promise((done) => {
    vfs
      .src(fixtures("*"), { buffer: false })
      .pipe(concat("test.js"))
      .on("error", function (err) {
        expect(err.message).toBe("gulp-concat: Streaming not supported");
        done();
      });
  });

});

test("should concat one file", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap")
      .pipe(concat("test.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.contents.toString()).toBe("wadap");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should concat multiple files", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap", "doe")
      .pipe(concat("test.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.contents.toString()).toBe("wadap\ndoe");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should concat buffers", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream([65, 66], [67, 68], [69, 70])
      .pipe(concat("test.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.contents.toString()).toBe("AB\nCD\nEF");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should preserve mode from files", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadaup")
      .pipe(concat("test.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.stat.mode).toBe(0o666);
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should take path from latest file", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = vfs
      .src([fixtures("*"), thirdPath])
      .pipe(concat("test.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((newFile) => {
          var newFilePath = path.resolve(newFile.path);
          var expectedFilePath = path.resolve(path.join(thirdBase, "test.js"));
          expect(newFilePath).toBe(expectedFilePath);
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should preserve relative path from files", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap", "doe")
      .pipe(concat("test.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.relative).toBe("test.js");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should support source maps", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = vfs
      .src(fixtures("*"))
      .pipe(initSourceMap())
      .pipe(concat("all.js"))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.sourceMap.sources.length).toBe(2);
          expect(d.sourceMap.file).toBe("all.js");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("should not fail if no files were input > when argument is a string", () => {
  expect(() => {
    var stream = concat("test.js");
    stream.end();
  }).not.toThrow();
});

test("should not fail if no files were input > when argument is an object", () => {
  expect(() => {
    var stream = concat({ path: "new.txt" });
    stream.end();
  }).not.toThrow();
});

test("options > should support newLine", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap", "doe")
      .pipe(concat("test.js", { newLine: "\r\n" }))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.contents.toString()).toBe("wadap\r\ndoe");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("options should support empty newLine", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap", "doe")
      .pipe(concat("test.js", { newLine: "" }))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.contents.toString()).toBe("wadapdoe");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("with object as argument > should throw without path", () => {
  const error = expect(() => {
    concat({ path: undefined });
  }).toThrow();

  expect(error.message).toBe("gulp-concat: Missing path in file options");
});

test("with object as argument > should create file based on path property", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap")
      .pipe(concat({ path: "new.txt" }))
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.path).toBe("new.txt");
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});

test("with object as argument > should calculate relative path from cwd and path in arguments", () => {
  return new Promise((done) => {
    let count = 0;
    const stream = startStream("wadap")
      .pipe(
        concat({
          cwd: path.normalize("/home/contra"),
          path: path.normalize("/home/contra/test/new.txt"),
        })
      )
      .pipe(
        transform(() => {
          count++;
        })
      )
      .pipe(
        assertFirst((d) => {
          expect(d.relative).toBe(path.normalize("test/new.txt"));
        })
      );

    stream.on("finish", () => {
      expect(count).toBe(1);
      done();
    });
  });
});
