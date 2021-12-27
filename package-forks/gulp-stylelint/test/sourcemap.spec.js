"use strict";

const Crafty = require("@swissquote/crafty/src/Crafty");
const Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");
const gulpCleanCss = require("gulp-clean-css");
const gulpConcat = require("gulp-concat");
const gulpRename = require("gulp-rename");
const gulpSourcemaps = require("gulp-sourcemaps");
const path = require("path");

const gulp = new Gulp(new Crafty({}));

const gulpStylelint = require("../src/index");

/**
 * Creates a full path to the fixtures glob.
 * @param {String} glob - Src glob.
 * @return {String} Full path.
 */
function fixtures(glob) {
  return path.join(__dirname, "fixtures", glob);
}

test("should emit no errors when stylelint rules are satisfied", () => {
  return new Promise((resolve) => {
    gulp
      .src(fixtures("original-*.css"))
      .pipe(gulpSourcemaps.init())
      .pipe(
        gulpStylelint({
          config: { rules: {} },
        })
      )
      .on("finish", resolve);
  });
});

// Disable sourcemaps as Crafty only lints original source files
test.skip("should apply sourcemaps correctly", () => {
  expect.assertions(5);

  return new Promise((resolve, reject) => {
    gulp
      .src(fixtures("original-*.css"))
      .pipe(gulpSourcemaps.init())
      .pipe(gulpCleanCss())
      .pipe(gulpConcat("concatenated.css"))
      .pipe(gulpRename({ prefix: "renamed-" }))
      .pipe(
        gulpStylelint({
          config: {
            rules: {
              "declaration-no-important": true,
            },
          },
          reporters: [
            {
              formatter(lintResult) {
                expect(lintResult.map((r) => r.source)).toEqual([
                  "original-a.css",
                  "original-b.css",
                ]);
                expect(lintResult[0].warnings[0].line).toEqual(2);
                expect(lintResult[0].warnings[0].column).toEqual(9);
                expect(lintResult[1].warnings[0].line).toEqual(2);
                expect(lintResult[1].warnings[0].column).toEqual(9);

                resolve();
              },
            },
          ],
        })
      )
      .on("error", reject);
  });
});

test("should ignore empty sourcemaps", () => {
  expect.assertions(5);

  return new Promise((resolve, reject) => {
    gulp
      .src(fixtures("original-*.css"))
      .pipe(gulpSourcemaps.init()) // empty sourcemaps here
      .pipe(
        gulpStylelint({
          config: {
            rules: {
              "declaration-no-important": true,
            },
          },
          reporters: [
            {
              formatter(lintResult) {
                expect(lintResult.map((r) => r.source)).toEqual([
                  path.join(__dirname, "fixtures", "original-a.css"),
                  path.join(__dirname, "fixtures", "original-b.css"),
                ]);
                expect(lintResult[0].warnings[0].line).toEqual(2);
                expect(lintResult[0].warnings[0].column).toEqual(15);
                expect(lintResult[1].warnings[0].line).toEqual(2);
                expect(lintResult[1].warnings[0].column).toEqual(16);
                resolve();
              },
            },
          ],
        })
      )
      .on("error", reject);
  });
});
