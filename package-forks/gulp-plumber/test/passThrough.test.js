"use strict";
const test = require("ava");

const { Readable, PassThrough, Transform } = require("node:stream");
const { finished } = require("node:stream/promises");

const Crafty = require("@swissquote/crafty/src/Crafty");
const Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");
const { peek } = require("./util");

const gulp = new Gulp(new Crafty({}));

const plumber = require("../");
const fixturesGlob = ["./test/fixtures/*"];

let expected = [];

test.before(function () {
  return new Promise((done) => {
    const stream = gulp
      .src(fixturesGlob)
      .pipe(peek((item) => expected.push(item)));
    stream.on("finish", done);
  });
});

test("should go through all files", async function (t) {
  t.plan(1);
  const actual = [];

  const stream = gulp
    .src(fixturesGlob)
    .pipe(plumber())
    .pipe(peek((file) => actual.push(file)));

  // Get the stream flowing
  stream.on("data", (data) => {});

  await finished(stream);

  t.deepEqual(
    actual.map((f) => f.path),
    expected.map((f) => f.path)
  );
});

test("piping into second plumber should keep piping", async function (t) {
  t.plan(1);
  const actual = [];

  const stream = gulp
    .src(fixturesGlob)
    .pipe(plumber())
    .pipe(new PassThrough({ objectMode: true }))
    .pipe(plumber())
    .pipe(peek((file) => actual.push(file)));

  // Get the stream flowing
  stream.on("data", (data) => {});

  await finished(stream);

  t.deepEqual(
    actual.map((f) => f.path),
    expected.map((f) => f.path)
  );
});

test("should work with readable array", async function (t) {
  const expected = ["1\n", "2\n", "3\n", "4\n", "5\n"];
  const actual = [];

  const stream = Readable.from([1, 2, 3, 4, 5])
    .pipe(plumber())
    .pipe(new Transform({
      objectMode: true,
      transform(e, enc, cb) {
        const string = JSON.stringify(Buffer.isBuffer(e) ? e.toString() : e) + '\n';
        cb(null, string);
      }
    }))
    .pipe(peek((file) => actual.push(file)));

  // Get the stream flowing
  stream.on("data", (data) => {});

  await finished(stream);

  t.deepEqual(
    actual.map((f) => f.path),
    expected.map((f) => f.path)
  );
});

test("should emit `end` after source emit `finish`", function (t) {
  t.plan(1);
  return new Promise((done, fail) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      // Fetchout data
      .on("data", function () {})
      .on("end", () => {
        t.truthy(true);
        done();
      })
      .on("error", fail);
  });
});
