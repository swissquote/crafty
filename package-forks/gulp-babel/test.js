const { Transform } = require("node:stream");
const { test } = require("node:test");
const { expect } = require("expect");
const path = require("path");
const Vinyl = require("vinyl");
const sourcemap = require("vinyl-sourcemap");
const babel = require(".");

test("should transpile with Babel", () => {
  return new Promise(done => {
    const stream = babel({
      plugins: ["@babel/transform-block-scoping"]
    });

    stream.on("data", file => {
      expect(/var foo/.test(file.contents.toString())).toBe(true);
      expect(file.relative).toBe("fixture.js");
    });

    stream.on("end", done);

    stream.write(
      new Vinyl({
        cwd: __dirname,
        base: path.join(__dirname, "fixture"),
        path: path.join(__dirname, "fixture/fixture.jsx"),
        contents: Buffer.from("let foo;")
      })
    );

    stream.end();
  });
});

function initSourceMap() {
  return new Transform({
    objectMode: true,
    transform(file, enc, callback) {
      sourcemap.add(file, (sourcemapErr, updatedFile) => {
        if (sourcemapErr) {
          callback(sourcemapErr);
          return;
        }

        callback(null, updatedFile);
      });
    }
  });
}

function writeSourceMap() {
  return new Transform({
    objectMode: true,
    transform(file, enc, callback) {
      var self = this;

      sourcemap.write(file, (sourcemapErr, updatedFile, sourcemapFile) => {
        if (sourcemapErr) {
          callback(sourcemapErr);
          return;
        }

        self.push(updatedFile);
        if (sourcemapFile) {
          self.push(sourcemapFile);
        }

        callback();
      });
    }
  });
}

test("should generate source maps", () => {
  return new Promise(done => {
    const init = initSourceMap();
    const write = writeSourceMap();

    init
      .pipe(
        babel({
          plugins: ["@babel/transform-arrow-functions"]
        })
      )
      .pipe(write);

    write.on("data", file => {
      expect(file.sourceMap.sources).toEqual(["fixture.es2015"]);
      expect(file.sourceMap.file).toBe("fixture.js");
      const contents = file.contents.toString();
      expect(/function/.test(contents)).toBe(true);
      expect(/sourceMappingURL/.test(contents)).toBe(true);
      done();
    });

    init.write(
      new Vinyl({
        cwd: __dirname,
        base: path.join(__dirname, "fixture"),
        path: path.join(__dirname, "fixture/fixture.es2015"),
        contents: Buffer.from("[].map(v => v + 1)"),
        sourceMap: ""
      })
    );

    init.end();
  });
});

test("should generate source maps for file in nested folder", () => {
  return new Promise(done => {
    const init = initSourceMap();
    const write = writeSourceMap();
    init
      .pipe(
        babel({
          plugins: ["@babel/transform-arrow-functions"]
        })
      )
      .pipe(write);

    write.on("data", file => {
      expect(file.sourceMap.sources).toEqual(["nested/fixture.es2015"]);
      expect(file.sourceMap.file).toBe("nested/fixture.js");
      const contents = file.contents.toString();
      expect(/function/.test(contents)).toBe(true);
      expect(/sourceMappingURL/.test(contents)).toBe(true);
      done();
    });

    init.write(
      new Vinyl({
        cwd: __dirname,
        base: path.join(__dirname, "fixture"),
        path: path.join(__dirname, "fixture/nested/fixture.es2015"),
        contents: Buffer.from("[].map(v => v + 1)"),
        sourceMap: ""
      })
    );

    init.end();
  });
});

test("should pass the result of transform().metadata in file.babel", () => {
  return new Promise(done => {
    const stream = babel({
      plugins: [
        {
          post(file) {
            file.metadata.test = "metadata";
          }
        }
      ]
    });

    stream.on("data", file => {
      expect(file.babel).toEqual({ test: "metadata" });
    });

    stream.on("end", done);

    stream.write(
      new Vinyl({
        cwd: __dirname,
        base: path.join(__dirname, "fixture"),
        path: path.join(__dirname, "fixture/fixture.js"),
        contents: Buffer.from("class MyClass {};")
      })
    );

    stream.end();
  });
});

test("should not rename ignored files", () => {
  return new Promise(done => {
    const stream = babel({
      ignore: [/fixture/]
    });

    const inputFile = {
      cwd: __dirname
    };

    inputFile.base = path.join(inputFile.cwd, "fixture");
    inputFile.basename = "fixture.jsx";
    inputFile.path = path.join(inputFile.base, inputFile.basename);
    inputFile.contents = Buffer.from(";");

    stream
      .on("data", file => {
        expect(file.relative).toBe(inputFile.basename);
      })
      .on("end", done)
      .end(new Vinyl(inputFile));
  });
});

test("should not rename files without an extension", () => {
  return new Promise(done => {
    const stream = babel();

    const inputFile = {
      cwd: __dirname
    };

    inputFile.base = path.join(inputFile.cwd, "bin");
    inputFile.basename = "app";
    inputFile.path = path.join(inputFile.base, inputFile.basename);
    inputFile.contents = Buffer.from(";");

    stream
      .on("data", file => {
        expect(file.relative).toBe(inputFile.basename);
      })
      .on("end", done)
      .end(new Vinyl(inputFile));
  });
});
