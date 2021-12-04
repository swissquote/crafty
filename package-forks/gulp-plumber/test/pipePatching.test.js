/*global describe, it, before */
"use strict";

const { suite } = require("uvu");
const assert = require("uvu/assert");

var es = require("event-stream"),
  noop = require("./util").noop,
  Crafty = require("@swissquote/crafty/src/Crafty"),
  Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

  const gulp = new Gulp(new Crafty({}));

var plumber = require("../");
var fixturesGlob = ["./test/fixtures/*"];

const it = suite("pipe");

let expected = null;

it("should keep piping after error", function() {
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
        assert.equal(actual, expected);
        done();
      });
  });
});

it("should skip patching with `inherit` === false", function() {
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
        assert.not.ok(lastNoop._plumbed);
        done();
      });
  });
});

it("piping into second plumber should does nothing", function() {
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
        assert.ok(lastNoop._plumbed);
        done();
      });
  });
});

it.before(async function() {
  return new Promise((done) => {
    gulp.src(fixturesGlob).pipe(
      es.writeArray(
        function(err, array) {
          expected = array;
          done();
        }
      )
    );
  });
});

it.run();

const it2 = suite("should be patched at itself and underlying streams");
it2("in non-flowing mode", function() {
  return new Promise((done) => {
    var lastNoop = noop();
    var mario = plumber();
    var m = gulp
      .src(fixturesGlob)
      .pipe(mario)
      .pipe(noop())
      .pipe(noop())
      .pipe(lastNoop)
      .on("end", function() {
        assert.ok(lastNoop._plumbed);
        done();
      });
  });
});

it2("in flowing mode", function() {
  return new Promise((done) => {
    var lastNoop = noop();
    var mario = plumber();
    gulp
      .src(fixturesGlob)
      .pipe(mario)
      .on("data", function(file) {
        assert.ok(file);
      })
      .pipe(noop())
      .pipe(noop())
      .pipe(lastNoop)
      .on("end", function() {
        assert.ok(lastNoop._plumbed);
        done();
      });
  });
});

it2.run();
