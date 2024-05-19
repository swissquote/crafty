"use strict";

const { Readable } = require("node:stream");
const { finished } = require("node:stream/promises");
const test = require("ava");

const es = require("event-stream");
const { peek, noop } = require("./util");
const Crafty = require("@swissquote/crafty/src/Crafty");
const Gulp = require("@swissquote/crafty-runner-gulp/src/Gulp.js");

const gulp = new Gulp(new Crafty({}));

const plumber = require("../");
const fixturesGlob = ["./test/fixtures/*"];

test("should keep piping after error", async (t) => {
    const expected = [1, 3, 5];

    const badBoy = es.through(function(data) {
      if (data % 2 === 0) {
        return this.emit("error", new Error(data));
      }
      this.emit("data", data);
    });

    const actual = [];
    const errors = [];
    let triggeredOnError = false;

    const stream = Readable.from([1, 2, 3, 4, 5, 6])
      .pipe(
        plumber({
          errorHandler(err) {
            errors.push(err);
          },
        })
      )
      .pipe(badBoy)
      .pipe(
        peek((data) => {
          actual.push(data);
        })
      )
      .on("error", () => {
        triggeredOnError = true;
      });

    // Get the stream flowing
    stream.on("data", () => {});

    await finished(stream);

    t.falsy(triggeredOnError);
    t.is(errors.length, 3);
    t.deepEqual(actual, expected);

});

test("should skip patching with `inherit` === false", (t) => {
  return new Promise((done) => {
    const lastNoop = noop();
    const mario = plumber({ inherit: false });
    gulp
      .src(fixturesGlob)
      .pipe(mario)
      .pipe(noop())
      .pipe(noop())
      .pipe(lastNoop)
      .on("finish", () => {
        t.falsy(plumber.isPlumbed(lastNoop));
        done();
      });
  });
});

test("piping into second plumber should do nothing", (t) => {
  return new Promise((done) => {
    const lastNoop = noop();
    gulp
      .src(fixturesGlob)
      .pipe(plumber())
      .pipe(noop())
      .pipe(noop())
      .pipe(plumber())
      .pipe(lastNoop)
      .on("finish", () => {
        t.truthy(plumber.isPlumbed(lastNoop));
        done();
      });
  });
});
