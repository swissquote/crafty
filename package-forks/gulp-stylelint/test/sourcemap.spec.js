const test = require("ava");

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

test("should emit no errors when stylelint rules are satisfied", (t) => {
  return t.notThrowsAsync(
    () =>
      new Promise((resolve) => {
        gulp
          .src(fixtures("original-*.css"))
          .pipe(gulpSourcemaps.init())
          .pipe(
            gulpStylelint({
              config: { rules: {} },
            })
          )
          .on("finish", resolve);
      })
  );
});

// Disable sourcemaps as Crafty only lints original source files
test.skip("should apply sourcemaps correctly", (t) => {
  t.plan(5);

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
                t.deepEqual(
                  lintResult.map((r) => r.source),
                  ["original-a.css", "original-b.css"]
                );
                t.deepEqual(lintResult[0].warnings[0].line, 2);
                t.deepEqual(lintResult[0].warnings[0].column, 9);
                t.deepEqual(lintResult[1].warnings[0].line, 2);
                t.deepEqual(lintResult[1].warnings[0].column, 9);

                resolve();
              },
            },
          ],
        })
      )
      .on("error", reject);
  });
});

test("should ignore empty sourcemaps", (t) => {
  t.plan(5);

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
                t.deepEqual(
                  lintResult.map((r) => r.source),
                  [
                    path.join(__dirname, "fixtures", "original-a.css"),
                    path.join(__dirname, "fixtures", "original-b.css"),
                  ]
                );
                t.deepEqual(lintResult[0].warnings[0].line, 2);
                t.deepEqual(lintResult[0].warnings[0].column, 15);
                t.deepEqual(lintResult[1].warnings[0].line, 2);
                t.deepEqual(lintResult[1].warnings[0].column, 16);
                resolve();
              },
            },
          ],
        })
      )
      .on("error", reject);
  });
});
