"use strict";
const { Readable } = require("node:stream");
const test = require("ava");

const through2 = require("through2");
const { peek } = require("./util");

const plumber = require("../");

test("should not keep piping after error", t => {
  return new Promise((done, fail) => {
    const expected = [1, 3, 5];

    const badBoy = through2.obj((data, enc, cb) => {
      if (data % 2 === 0) {
        return cb(new Error(data));
      }
      cb(null, data)
    });

    const badass = through2.obj((data, enc, cb) => {
      if (data === 5) {
        return cb(new Error("Badass"));
      }
      cb(null, data)
    });

    const actual = [];
    const errors = []

    Readable.from([1, 2, 3, 4, 5, 6])
      .pipe(plumber({
        errorHandler(err) {
          errors.push(err);
        },
      }))
      .pipe(badBoy)
      .pipe(
        peek((data) => { actual.push(data); })
      )
      .pipe(plumber.stop())
      .pipe(badass)
      .on("error", function(err) {
        // we should have seen two errors by the time the stream fails
        t.is(errors.length, 2);

        t.truthy(err instanceof Error);
        t.deepEqual(actual, expected);
        done();
      })
      .on("end", function() {
        fail("Error was not fired");
      });
  });
});
