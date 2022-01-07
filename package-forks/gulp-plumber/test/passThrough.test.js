"use strict";

const test = require("ava");

const { Transform } = require("stream");

var es = require("event-stream"),
  Crafty = require("@swissquote/crafty/src/Crafty"),
  Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

  const gulp = new Gulp(new Crafty({}));

var plumber = require("../");
var fixturesGlob = ["./test/fixtures/*"];

let expected = null;

test("piping into second plumber should keep piping", function(t) {
  return new Promise((done) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      .pipe(new Transform({objectMode: true, transform(file, enc, cb) { cb(null, file); }}))
      .pipe(plumber())
      .pipe(
        es.writeArray(
          function(err, array) {
            t.deepEqual(array, expected);
            done();
          }
        )
      )
      .on("end", function() {
        done();
      });
  });
});

test("should work with es.readarray", function(t) {
  return new Promise((done) => {
    var expected = ["1\n", "2\n", "3\n", "4\n", "5\n"];

    es.readArray([1, 2, 3, 4, 5])
      .pipe(plumber())
      .pipe(es.stringify())
      .pipe(
        es.writeArray(function(error, array) {
          t.deepEqual(array, expected);

          done();
        })
      );
  });
});

test("should emit `end` after source emit `finish`", function(t) {
  t.plan(1);
  return new Promise((done, fail) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      // Fetchout data
      .on("data", function() {})
      .on("end", () => {
        t.truthy(true);
        done();
      })
      .on("error", fail);
  });
});

test.before(function() {
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

test("should passThrough all incoming files in non-flowing mode", function(t) {
  return new Promise((done, fail) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber({ errorHandler: fail }))
      .pipe(
        es.writeArray(
          function(err, array) {
            t.deepEqual(array, expected);
            done();
          }
        )
      )
      .on("error", fail);
  });
});

// test('in flowing mode', function (done) {
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
