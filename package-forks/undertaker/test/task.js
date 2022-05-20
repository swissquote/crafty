"use strict";

const test = require("ava");

var Undertaker = require("../");

function noop(done) {
  done();
}

test("should register a named function", function(t) {
  var taker = new Undertaker();
  taker.task(noop);
  t.is(taker.task("noop").unwrap(), noop);
});

test("should register an anonymous function by string name", function(t) {
  var taker = new Undertaker();
  var anon = function() {};
  taker.task("test1", anon);
  t.is(taker.task("test1").unwrap(), anon);
});

test("should register an anonymous function by displayName property", function(t) {
  var taker = new Undertaker();
  var anon = function() {};
  anon.displayName = "<display name>";
  taker.task(anon);
  t.is(taker.task("<display name>").unwrap(), anon);
  delete anon.displayName;
});

test("should throw on register an anonymous function without string name", function(t) {
  var taker = new Undertaker();
  function noName() {
    taker.task(function() {});
  }

  t.throws(noName, {message: "Task name must be specified"})
});

test("should register a named function by string name", function(t) {
  var taker = new Undertaker();
  taker.task("test1", noop);
  t.is(taker.task("test1").unwrap(), noop);
});

test("should not get a task that was not registered", function(t) {
  var taker = new Undertaker();
  t.is(taker.task("test1"), undefined);
});

test("should get a task that was registered", function(t) {
  var taker = new Undertaker();
  taker.task("test1", noop);
  t.is(taker.task("test1").unwrap(), noop);
});

test("should get the wrapped task, not original function", function(t) {
  var taker = new Undertaker();
  var registry = taker.registry();
  taker.task("test1", noop);
  t.is(typeof taker.task("test1").unwrap, "function");
  t.is(taker.task("test1"), registry.get("test1"));
});

test("provides an `unwrap` method to get the original function", function(t) {
  var taker = new Undertaker();
  taker.task("test1", noop);
  t.is(typeof taker.task("test1").unwrap, "function");
  t.is(taker.task("test1").unwrap(), noop);
});

test("should return a function that was registered in some other way", function(t) {
  var taker = new Undertaker();
  taker.registry()._tasks.test1 = noop;
  t.is(taker.task("test1"), noop);
});

test("should prefer displayName instead of name when both properties are defined", function(t) {
  var taker = new Undertaker();
  function fn() {}
  fn.displayName = "test1";
  taker.task(fn);
  t.is(taker.task("test1").unwrap(), fn);
});

test("should allow different tasks to refer to the same function", function(t) {
  var taker = new Undertaker();
  function fn() {}
  taker.task("foo", fn);
  taker.task("bar", fn);
  t.is(taker.task("foo").unwrap(), taker.task("bar").unwrap());
});

test("should allow using aliased tasks in composite tasks", async function(t) {
  t.plan(2);
  var taker = new Undertaker();
  var count = 0;
  function fn(cb) {
    count++;
    cb();
  }

  taker.task("foo", fn);
  taker.task("bar", fn);

  var series = taker.series("foo", "bar", function(cb) {
    t.is(count, 2);
    cb();
  });

  var parallel = taker.parallel("foo", "bar", function(cb) {
    setTimeout(function() {
      t.is(count, 4);
      cb();
    }, 500);
  });

  await new Promise(resolve => {
    taker.series(series, parallel)(resolve);
  });  
});

test("should allow composite tasks tasks to be aliased", async function(t) {
  t.plan(2);
  var taker = new Undertaker();
  var count = 0;
  function fn1(cb) {
    count += 1;
    cb();
  }
  function fn2(cb) {
    count += 2;
    cb();
  }

  taker.task("ser", taker.series(fn1, fn2));
  taker.task("foo", taker.task("ser"));

  taker.task("par", taker.parallel(fn1, fn2));
  taker.task("bar", taker.task("par"));

  var series = taker.series("foo", function(cb) {
    t.is(count, 3);
    cb();
  });

  var parallel = taker.series("bar", function(cb) {
    setTimeout(function() {
      t.is(count, 6);
      cb();
    }, 500);
  });

  await new Promise(resolve => {
    taker.series(series, parallel)(resolve);
  });  
});
