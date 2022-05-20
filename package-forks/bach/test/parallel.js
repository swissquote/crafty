"use strict";

const test = require("ava");

var bach = require("../");

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

test("should execute functions in parallel, passing results", function(t) {
  t.plan(2);
  return new Promise(resolve => bach.parallel(
    fn1,
    fn2,
    fn3
  )(function(error, results) {
    t.is(error, null);
    t.deepEqual(results, [1, 2, 3]);
    resolve();
  }));
});

test("should execute functions in parallel, passing error", async function(t) {
  t.plan(2);
  function slowFn(done) {
    setTimeout(function() {
      t.fail("Slow function should not be called");
      done(null, 2);
    }, 500);
  }
  
  return new Promise(resolve => bach.parallel(
    fn1,
    slowFn,
    fn3,
    fnError
  )(function(error, results) {
    t.true(error instanceof Error);
    t.deepEqual(results, [1, undefined, 3, undefined]);
    resolve();
  }));
});

test("should take extension points and call them for each function", function(t) {
  t.plan(11);
  var arr = [];
  var fns = [fn1, fn2, fn3];
  return new Promise(resolve => bach.parallel(fn1, fn2, fn3, {
    create: function(fn, idx) {
      t.true(fns.some(e => e === fn));
      arr[idx] = fn;
      return arr;
    },
    before: function(storage) {
      t.is(storage, arr);
    },
    after: function(result, storage) {
      t.is(storage, arr);
    },
  })(function(error) {
    t.is(error, null);
    t.deepEqual(arr, fns);
    resolve();
  }));
});
