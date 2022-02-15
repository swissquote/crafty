const test = require("ava");

const fs = require("fs");
const Crafty = require("@swissquote/crafty/src/Crafty");
const Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

const gulp = new Gulp(new Crafty({}));
const path = require("path");

const gulpStylelint = require("../src/index");

/**
 * Creates a full path to the fixtures glob.
 * @param {String} glob - Src glob.
 * @return {String} Full path.
 */
function fixtures(glob) {
  return path.join(__dirname, "fixtures", glob);
}

test("should not throw when no arguments are passed", (t) => {
  t.plan(1);
  t.notThrows(gulpStylelint);
});

test("should emit an error on streamed file", (t) => {
  t.plan(1);
  return new Promise((resolve) => {
    gulp
      .src(fixtures("basic.css"), { buffer: false })
      .pipe(gulpStylelint())
      .on("error", (error) => {
        t.deepEqual(error.message, "Streaming is not supported");
        resolve();
      });
  });
});

test("should NOT emit an error when configuration is set", (t) => {
  return t.notThrowsAsync(
    () =>
      new Promise((resolve, reject) => {
        gulp
          .src(fixtures("basic.css"))
          .pipe(gulpStylelint({ config: { rules: [] } }))
          .on("error", reject)
          .on("finish", resolve);
      })
  );
});

test("should emit an error when linter complains", (t) => {
  t.plan(1);
  return new Promise((resolve) => {
    gulp
      .src(fixtures("invalid.css"))
      .pipe(
        gulpStylelint({
          config: {
            rules: {
              "color-hex-case": "lower",
            },
          },
        })
      )
      .on("error", (error) => {
        t.truthy(error instanceof Error);
        resolve();
      });
  });
});

test("should ignore file", (t) => {
  return t.notThrowsAsync(
    () =>
      new Promise((resolve, reject) => {
        gulp
          .src([fixtures("basic.css"), fixtures("invalid.css")])
          .pipe(
            gulpStylelint({
              config: { rules: { "color-hex-case": "lower" } },
              ignorePath: fixtures("ignore"),
            })
          )
          .on("error", reject)
          .on("finish", resolve);
      })
  );
});

test("should fix the file without emitting errors", (t) => {
  t.plan(1);

  return new Promise((resolve, reject) => {
    gulp
      .src(fixtures("invalid.css"), { sourcemaps: true })
      .pipe(
        gulpStylelint({
          fix: true,
          config: { rules: { "color-hex-case": "lower" } },
        })
      )
      .pipe(gulp.dest(path.resolve(__dirname, "../tmp")))
      .on("error", reject)
      .on("finish", () => {
        t.deepEqual(
          fs.readFileSync(
            path.resolve(__dirname, "../tmp/invalid.css"),
            "utf8"
          ),
          ".foo {\n  color: #fff;\n}\n"
        );
        resolve();
      });
  });
});

test("should expose an object with stylelint formatter functions", (t) => {
  t.plan(2);
  t.deepEqual(typeof gulpStylelint.formatters, "object");

  const formatters = Object.keys(gulpStylelint.formatters).map(
    (fName) => gulpStylelint.formatters[fName]
  );

  t.truthy(formatters.every((f) => typeof f === "function"));
});
