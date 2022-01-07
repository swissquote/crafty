"use strict";

const test = require("ava");

var es = require("event-stream"),
  noop = require("./util").noop,
  Crafty = require("@swissquote/crafty/src/Crafty"),
  Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

  const gulp = new Gulp(new Crafty({}));

var plumber = require("../");
var fixturesGlob = ["./test/fixtures/*"];

test.before(async function() {
  return new Promise((done) => {
    gulp.src(fixturesGlob).pipe(
      es.writeArray(() => done())
    );
  });
});

test("should keep piping after error", (t) => {
  return new Promise((done, fail) => {
    var expected = [1, 3, 5];

    var badBoy = es.through(function(data) {
      if (data % 2 === 0) {
        return this.emit("error", new Error(data));
      }
      this.emit("data", data);
    });

    var actual = [];

    es.readArray([1, 2, 3, 4, 5, 6])
      .pipe(plumber())
      .pipe(badBoy)
      .pipe(
        es.through(function(data) {
          actual.push(data);
          this.emit("data", data);
        })
      )
      .on("error", function(err) {
        fail(err);
      })
      .on("end", function() {
        t.deepEqual(actual, expected);
        done();
      });
  });
});

test("should skip patching with `inherit` === false", (t) => {
  return new Promise((done) => {
    var lastNoop = noop();
    var mario = plumber({ inherit: false });
    gulp
      .src(fixturesGlob)
      .pipe(mario)
      .pipe(noop())
      .pipe(noop())
      .pipe(lastNoop)
      .on("end", function() {
        t.falsy(lastNoop._plumbed);
        done();
      });
  });
});

test("piping into second plumber should does nothing", (t) => {
  return new Promise((done) => {
    var lastNoop = noop();
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      .pipe(noop())
      .pipe(noop())
      .pipe(plumber())
      .pipe(lastNoop)
      .on("end", function() {
        t.truthy(lastNoop._plumbed);
        done();
      });
  });
});
