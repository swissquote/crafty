"use strict";
const { Readable } = require("node:stream");
const test = require("ava");

const es = require("event-stream");
const { peek } = require("./util");

const plumber = require("../");

test("should not keep piping after error", t => {
  return new Promise((done, fail) => {
    const expected = [1, 3, 5];

    const badBoy = es.through(function(data) {
      if (data % 2 === 0) {
        return this.emit("error", new Error(data));
      }
      this.emit("data", data);
    });

    const badass = es.through(function(data) {
      if (data === 5) {
        return this.emit("error", new Error("Badass"));
      }
      this.emit("data", data);
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
