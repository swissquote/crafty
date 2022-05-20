"use strict";

const test = require("ava");

var Undertaker = require("../");

var taker, test1, test2, error, alias;
var defaultResolution = process.env.UNDERTAKER_TIME_RESOLUTION;

test.beforeEach(function() {
  process.env.UNDERTAKER_TIME_RESOLUTION = "0";
  taker = new Undertaker();

  test1 = function(cb) {
    cb();
  };
  taker.task("test1", test1);

  test2 = function(cb) {
    cb();
  };
  test2.displayName = "test2";
  taker.task(test2);

  error = function(cb) {
    cb(new Error());
  };
  taker.task("error", error);

  alias = test1;
  taker.task("alias", alias);
});

test.afterEach(function() {
  process.env.UNDERTAKER_TIME_RESOLUTION = defaultResolution;
});

test("should only record time when task has completed", async function(t) {
  t.plan(1);
  var ts;
  var test = function(cb) {
    ts = taker.lastRun("test");
    cb();
  };
  taker.task("test", test);
  await new Promise((resolve, reject) =>
    taker.parallel("test")(function(err) {
      t.is(ts, undefined);
      if (err) { reject(err) } else { resolve();}
    })
  );
});

test("should record tasks time execution", async function(t) {
  t.plan(5);
  await new Promise((resolve, reject) =>
    taker.parallel("test1")(function(err) {
      t.truthy(taker.lastRun("test1"));
      t.true(taker.lastRun("test1") <= Date.now());
      t.is(taker.lastRun(test2), undefined);
      t.is(taker.lastRun(function() {}), undefined);
      t.throws(taker.lastRun.bind(taker, "notexists"), {instanceOf: Error});
      if (err) { reject(err) } else { resolve();}
    })
  );
});

test("should record all tasks time execution", async function(t) {
  t.plan(4);
  await new Promise((resolve, reject) =>
    taker.parallel(
      "test1",
      test2
    )(function(err) {
      t.truthy(taker.lastRun("test1"));
      t.true(taker.lastRun("test1") <= Date.now());
      t.truthy(taker.lastRun(test2));
      t.true(taker.lastRun(test2) <= Date.now());
      if (err) { reject(err) } else { resolve();}
    })
  );
});

test("should record same tasks time execution for a string task and its original", async function(t) {
  t.plan(1);
  await new Promise((resolve, reject) =>
    taker.series(test2)(function(err) {
      t.is(taker.lastRun(test2), taker.lastRun("test2"));
      if (err) { reject(err) } else { resolve();}
    })
  );
});

test("should record tasks time execution for an aliased task", async function(t) {
  t.plan(1);
  await new Promise((resolve, reject) =>
    taker.series("alias")(function(err) {
      t.is(taker.lastRun("alias"), taker.lastRun("test1"));
      if (err) { reject(err) } else { resolve();}
    })
  );
});

test("should give time with 1s resolution", async function(t) {
  t.plan(1);
  var resolution = 1000; // 1s
  var since = Date.now();
  var expected = since - (since % resolution);

  await new Promise((resolve, reject) =>
    taker.series("test1")(function() {
      t.is(taker.lastRun("test1", resolution), expected);
      resolve();
    })
  );
});

test("should not record task start time on error", async function(t) {
  t.plan(2);
  taker.on("error", function() {
    // To keep the test from catching the emitted errors
  });
  await new Promise((resolve, reject) =>
    taker.series("error")(function(err) {
      t.truthy(err);
      t.is(taker.lastRun("error"), undefined);
      resolve();
    })
  );
});
