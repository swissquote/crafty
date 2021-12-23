"use strict";

const { suite } = require("uvu");
const assert = require("uvu/assert");

const { Transform } = require("stream");

var es = require("event-stream"),
  through2 = require("through2"),
  EE = require("events").EventEmitter,
  Crafty = require("@swissquote/crafty/src/Crafty"),
  Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

  const gulp = new Gulp(new Crafty({}));

var plumber = require("../");

var errorMessage = "Error: Bang!";
var fixturesGlob = ["./test/fixtures/index.js", "./test/fixtures/test.js"];
var delay = 20;

let failingQueueStream = null;

const it = suite("errorHandler");

it.before.each(function() {
  var i = 0;
  failingQueueStream = new es.through(function(file) {
    this.queue(file);
    i++;
    if (i === 2) {
      this.emit("error", new Error("Bang!"));
    }
  });
});

it.before(function() {
  return new Promise((done) => {
    gulp.src(fixturesGlob).pipe(
      es.writeArray(() => {
        done();
      })
    );
  });
});

it("should attach custom error handler", function() {
  return new Promise((done) => {
    gulp
      .src(fixturesGlob)
      .pipe(
        plumber({
          errorHandler: function(error) {
            assert.equal(error.toString(), errorMessage);
            //error.toString().should.containEql(errorMessage);
            done();
          },
        })
      )
      .pipe(failingQueueStream);
  });
});

it("should attach custom error handler with function argument", function() {
  return new Promise((done) => {
    gulp
      .src(fixturesGlob)
      .pipe(
        plumber(function(error) {
          assert.equal(error.toString(), errorMessage);
          //error.toString().should.containEql(errorMessage);
          done();
        })
      )
      .pipe(failingQueueStream);
  });
});

it("should attach default error handler", function() {
  return new Promise((done) => {
    var mario = plumber();
    mario.errorHandler = function(error) {
      assert.equal(error.toString(), errorMessage);
      //error.toString().should.containEql(errorMessage);
      done();
    };
    gulp
      .src(fixturesGlob)
      .pipe(mario)
      .pipe(failingQueueStream);
  });
});

it.skip("default error handler should work", function() {
  // TODO: Find alternative way to test error handler (`gutil.log` was replaced by `fancyLog`)
  // var mario = plumber();
  // var _ = gutil.log;
  // gutil.log = done.bind(null, null);
  // gulp.src(fixturesGlob)
  //     .pipe(mario)
  //     .pipe(this.failingQueueStream)
  //     .on('end', function () {
  //         gutil.log = _;
  //     });
});

it("should attach error handler in non-flowing mode", function() {
  return new Promise((done) => {
    var delayed = new Transform({objectMode: true, transform(file, enc, cb) { cb(null, file); }});
    setTimeout(delayed.write.bind(delayed, "data"), delay);
    setTimeout(delayed.write.bind(delayed, "data"), delay);
    delayed
      .pipe(plumber({ errorHandler: () => done() }))
      .pipe(failingQueueStream);
  });
});

// it.only('in flowing mode', function (done) {
//     var delayed = new Transform({objectMode: true, transform(file, enc, cb) { cb(null, file); }});
//     setTimeout(delayed.write.bind(delayed, 'data'), delay);
//     setTimeout(delayed.write.bind(delayed, 'data'), delay);
//     delayed
//         .pipe(plumber({ errorHandler: done.bind(null, null) }))
// // You cant do on('data') and pipe simultaniously.
//         .on('data', function () { })
//         .pipe(this.failingQueueStream);
// });

it("should not attach error handler in non-flowing mode", function() {
  return new Promise((done) => {
    gulp
      .src(fixturesGlob)
      .pipe(plumber({ errorHandler: false }))
      .pipe(failingQueueStream)
      .on("error", (err) => {
        assert.instance(err, Error);
        done();
      })
      .on("end", () => {});
  });
});

// it('in flowing mode', function (done) {
//     (function () {
//         gulp.src(fixturesGlob)
//             .pipe(plumber({ errorHandler: false }))
// // You cant do on('data') and pipe simultaniously.
//             .on('data', function () { })
//             .pipe(failingQueueStream)
//             .on('end', done);
//     }).should.throw();
//     done();
// });

it("throw on piping to undefined", function() {
  assert.throws(() => plumber.pipe());
});

it("throw after cleanup", function() {
  var mario = plumber({ errorHandler: false });
  var stream = mario.pipe(through2.obj());

  assert.throws(() => {
    stream.emit("error", new Error(errorMessage));
  });

  assert.equal(EE.listenerCount(mario, "data"), 0);
  assert.equal(EE.listenerCount(mario, "drain"), 0);
  assert.equal(EE.listenerCount(mario, "error"), 0);
  assert.equal(EE.listenerCount(mario, "close"), 0);

  assert.equal(EE.listenerCount(stream, "data"), 0);
  assert.equal(EE.listenerCount(stream, "drain"), 0);
  assert.equal(EE.listenerCount(stream, "error"), 0);
  assert.equal(EE.listenerCount(stream, "close"), 0);
});

it.run();
