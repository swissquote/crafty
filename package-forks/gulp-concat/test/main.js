const concat = require("../");
const fs = require("fs/promises");
const path = require("path");
const { Transform } = require("node:stream");
const startStream = require("./test-stream");
const test = require("ava");
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

test("should throw, when arguments is missing", function (t) {
  const error = t.throws(concat);
  t.is(error.message, "gulp-concat: Missing file option");
});

test("should ignore null files", function (t) {
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
      t.is(count, 0);
      done();
    });
  });
});

// Somehow the error isn't propagated through the stream, unclear why
test.skip("should emit error on streamed file", (t) => {
  return new Promise((done) => {
    vfs
      .src(fixtures("*"), { buffer: false })
      .pipe(concat("test.js"))
      .on("error", function (err) {
        t.is(err.message, "gulp-concat: Streaming not supported");
        done();
      });
  });

});

test("should concat one file", (t) => {
  t.plan(2);
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
          console.log("running assertion")
          t.is(d.contents.toString(), "wadap");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("should concat multiple files", (t) => {
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
          t.is(d.contents.toString(), "wadap\ndoe");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("should concat buffers", (t) => {
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
          t.is(d.contents.toString(), "AB\nCD\nEF");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("should preserve mode from files", (t) => {
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
          t.is(d.stat.mode, 0o666);
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("should take path from latest file", (t) => {
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
          t.is(newFilePath, expectedFilePath);
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("should preserve relative path from files", (t) => {
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
          t.is(d.relative, "test.js");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("should support source maps", (t) => {
  t.plan(3);
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
          t.is(d.sourceMap.sources.length, 2);
          t.is(d.sourceMap.file, "all.js");
        })
      );

    stream.on("finish", () => {
      console.log("Got to the end")
      t.is(count, 1);
      done();
    });
  });
});

test("should not fail if no files were input > when argument is a string", (t) => {
  t.notThrows(() => {
    var stream = concat("test.js");
    stream.end();
  })
});

test("should not fail if no files were input > when argument is an object", (t) => {
  t.notThrows(() => {
    var stream = concat({ path: "new.txt" });
    stream.end();
  })
});

test("options > should support newLine", (t) => {
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
          t.is(d.contents.toString(), "wadap\r\ndoe");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("options should support empty newLine", (t) => {
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
          t.is(d.contents.toString(), "wadapdoe");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("with object as argument > should throw without path", (t) => {
  const error = t.throws(() => {
    concat({ path: undefined });
  }) 

  t.is(error.message, "gulp-concat: Missing path in file options");
});

test("with object as argument > should create file based on path property", (t) => {
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
          t.is(d.path, "new.txt");
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});

test("with object as argument > should calculate relative path from cwd and path in arguments", (t) => {
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
          t.is(d.relative, path.normalize("test/new.txt"));
        })
      );

    stream.on("finish", () => {
      t.is(count, 1);
      done();
    });
  });
});
