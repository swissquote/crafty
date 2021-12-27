"use strict";

const fs = require("fs");
const Crafty = require("@swissquote/crafty/src/Crafty");
const Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

const gulp = new Gulp(new Crafty({}));
const gulpSourcemaps = require("gulp-sourcemaps");
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

it("should not throw when no arguments are passed", () => {
  expect.assertions(1);
  expect(gulpStylelint).not.toThrow();
});

test("should emit an error on streamed file", () => {
  expect.assertions(1);
  return new Promise((resolve) => {
    gulp
      .src(fixtures("basic.css"), { buffer: false })
      .pipe(gulpStylelint())
      .on("error", (error) => {
        expect(error.message).toEqual("Streaming is not supported");
        resolve();
      });
  });
});

test("should NOT emit an error when configuration is set", () => {
  return new Promise((resolve, reject) => {
    gulp
      .src(fixtures("basic.css"))
      .pipe(gulpStylelint({ config: { rules: [] } }))
      .on("error", reject)
      .on("finish", resolve);
  });
});

test("should emit an error when linter complains", () => {
  expect.assertions(1);
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
        expect(error).toBeInstanceOf(Error);
        resolve();
      });
  });
});

test("should ignore file", () => {
  return new Promise((resolve, reject) => {
    gulp
      .src([fixtures("basic.css"), fixtures("invalid.css")])
      .pipe(
        gulpStylelint({
          config: { rules: { "color-hex-case": "lower" } },
          ignorePath: fixtures("ignore"),
        })
      )
      .on("finish", resolve);
  });
});

test("should fix the file without emitting errors", () => {
  expect.assertions(1);

  return new Promise((resolve, reject) => {
    gulp
      .src(fixtures("invalid.css"))
      .pipe(gulpSourcemaps.init())
      .pipe(
        gulpStylelint({
          fix: true,
          config: { rules: { "color-hex-case": "lower" } },
        })
      )
      .pipe(gulp.dest(path.resolve(__dirname, "../tmp")))
      .on("error", reject)
      .on("finish", () => {
        expect(
          fs.readFileSync(path.resolve(__dirname, "../tmp/invalid.css"), "utf8")
        ).toEqual(".foo {\n  color: #fff;\n}\n");
        resolve();
      });
  });
});

test("should expose an object with stylelint formatter functions", () => {
  expect.assertions(2);
  expect(typeof gulpStylelint.formatters).toEqual("object");

  const formatters = Object.keys(gulpStylelint.formatters).map(
    (fName) => gulpStylelint.formatters[fName]
  );

  expect(formatters.every((f) => typeof f === "function")).toBe(true);
});
