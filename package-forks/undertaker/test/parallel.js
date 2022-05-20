"use strict";

const test = require("ava");

var Undertaker = require("../");

function fn1(done) {
  done(null, 1);
}

function fn2(done) {
  setTimeout(function() {
    done(null, 2);
  }, 500);
}

function fn3(done) {
  done(null, 3);
}

function fnError(done) {
  done(new Error("An Error Occurred"));
}

var taker;

test.beforeEach(function() {
  taker = new Undertaker();
  taker.task("test1", fn1);
  taker.task("test2", fn2);
  taker.task("test3", fn3);
  taker.task("error", fnError);
});

test("should throw on non-valid tasks combined with valid tasks", function(t) {
  function fail() {
    taker.parallel("test1", "test2", "test3", {});
  }

  t.throws(fail, { message: /Task never defined:/ });
});

test("should throw on tasks array with both valid and non-valid tasks", function(t) {
  function fail() {
    taker.parallel(["test1", "test2", "test3", {}]);
  }

  t.throws(fail, { message: /Task never defined:/ });
});

test("should throw on non-valid task", function(t) {
  function fail() {
    taker.parallel({});
  }

  t.throws(fail, { message: /Task never defined:/ });
});

test("should throw when no tasks specified", function(t) {
  function fail() {
    taker.parallel();
  }

  t.throws(fail, {
    message: /One or more tasks should be combined using series or parallel/,
  });
});

test("should throw on empty array of registered tasks", function(t) {
  function fail() {
    taker.parallel([]);
  }

  t.throws(fail, {
    message: /One or more tasks should be combined using series or parallel/,
  });
});

test("should take only one array of registered tasks", async function(t) {
  t.plan(1);
  await new Promise((resolve, reject) =>
    taker.parallel(["test1", "test2", "test3"])(function(err, results) {
      t.deepEqual(results, [1, 2, 3]);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});

test("should take all string names", async function(t) {
  t.plan(1);
  await new Promise((resolve, reject) =>
    taker.parallel(
      "test1",
      "test2",
      "test3"
    )(function(err, results) {
      t.deepEqual(results, [1, 2, 3]);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});

test("should take all functions", async function(t) {
  t.plan(1);
  await new Promise((resolve, reject) =>
    taker.parallel(
      fn1,
      fn2,
      fn3
    )(function(err, results) {
      t.deepEqual(results, [1, 2, 3]);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});

test("should take string names and functions", async function(t) {
  t.plan(1);
  await new Promise((resolve, reject) =>
    taker.parallel(
      "test1",
      fn2,
      "test3"
    )(function(err, results) {
      t.deepEqual(results, [1, 2, 3]);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});

test("should take nested parallel", async function(t) {
  t.plan(1);
  var parallel1 = taker.parallel("test1", "test2", "test3");
  await new Promise((resolve, reject) =>
    taker.parallel(
      "test1",
      parallel1,
      "test3"
    )(function(err, results) {
      t.deepEqual(results, [1, [1, 2, 3], 3]);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});

test("should stop processing on error", async function(t) {
  t.plan(2);
  taker.on("error", function() {
    // To keep the test from catching the emitted errors
  });
  await new Promise((resolve) =>
    taker.parallel(
      "test1",
      "error",
      "test3"
    )(function(err, results) {
      t.true(err instanceof Error);
      t.deepEqual(results, [1, undefined, undefined]);
      resolve();
    })
  );
});

test("should throw on unregistered task", function(t) {
  function unregistered() {
    taker.parallel("unregistered");
  }

  t.throws(unregistered, { message: "Task never defined: unregistered" });
});

test("should process all functions if settle flag is true", async function(t) {
  t.plan(2);
  taker.on("error", function() {
    // To keep the test from catching the emitted errors
  });
  taker._settle = true;
  await new Promise((resolve) =>
    taker.parallel(
      taker.parallel("test1", "error"),
      "test3"
    )(function(err, results) {
      t.true(err[0][0] instanceof Error);
      t.deepEqual(results, [3]);
      resolve();
    })
  );
});

test("should not register a displayName on the returned function by default", function(t) {
  var task = taker.parallel(fn1);
  t.is(task.displayName, undefined);
});
