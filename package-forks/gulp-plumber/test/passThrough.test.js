/*global describe, it, before */
"use strict";

const { suite } = require("uvu");
const assert = require("uvu/assert");

var through2 = require("through2"),
  es = require("event-stream"),
  Crafty = require("@swissquote/crafty/src/Crafty"),
  Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

  const gulp = new Gulp(new Crafty({}));

var plumber = require("../");
var fixturesGlob = ["./test/fixtures/*"];

let expected = null;

const it = suite("stream");

it("piping into second plumber should keep piping", function(done) {
  return new Promise((done) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      .pipe(through2.obj())
      .pipe(plumber())
      .pipe(
        es.writeArray(
          function(err, array) {
            assert.equal(array, expected);
            done();
          }
        )
      )
      .on("end", function() {
        done();
      });
  });
});

it("should work with es.readarray", function() {
  return new Promise((done) => {
    var expected = ["1\n", "2\n", "3\n", "4\n", "5\n"];

    es.readArray([1, 2, 3, 4, 5])
      .pipe(plumber())
      .pipe(es.stringify())
      .pipe(
        es.writeArray(function(error, array) {
          assert.equal(array, expected);

          done();
        })
      );
  });
});

it("should emit `end` after source emit `finish`", function() {
  return new Promise((done, fail) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      // Fetchout data
      .on("data", function() {})
      .on("end", done)
      .on("error", fail);
  });
});

it.before(function() {
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

it("should passThrough all incoming files in non-flowing mode", function(done) {
  return new Promise((done, fail) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber({ errorHandler: fail }))
      .pipe(
        es.writeArray(
          function(err, array) {
            assert.equal(array, expected);
            done();
          }
        )
      )
      .on("error", fail);
  });
});

// it('in flowing mode', function (done) {
//     gulp.src(fixturesGlob)
//         .pipe(plumber({ errorHandler: done }))
// // You cant do on('data') and pipe simultaniously.
//         .on('data', function (file) { should.exist(file); })
//         .pipe(es.writeArray(function (err, array) {
//             array.should.eql(this.expected);
//             done();
//         }.bind(this)))
//         .on('error', done);
// });

it.run();
