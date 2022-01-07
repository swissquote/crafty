"use strict";

const test = require("ava");

var es = require("event-stream"),
Crafty = require("@swissquote/crafty/src/Crafty"),
Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

const gulp = new Gulp(new Crafty({}));

var plumber = require("../");
var fixturesGlob = ["./test/fixtures/*"];

test("should not keep piping after error", t => {
  return new Promise((done, fail) => {
    var expected = [1, 3, 5];

    var badBoy = es.through(function(data) {
      if (data % 2 === 0) {
        return this.emit("error", new Error(data));
      }
      this.emit("data", data);
    });

    var badass = es.through(function(data) {
      if (data === 5) {
        return this.emit("error", new Error("Badass"));
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
      .pipe(plumber.stop())
      .pipe(badass)
      .on("error", function(err) {
        t.truthy(err instanceof Error);
        t.deepEqual(actual, expected);
        done();
      })
      .on("end", function() {
        fail("Error was not fired");
      });
  });
});

test.before(function() {
  return new Promise((done) => {
    gulp.src(fixturesGlob).pipe(
      es.writeArray(
        function() {
          done();
        }
      )
    );
  });
});
