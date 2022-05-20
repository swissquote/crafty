"use strict";

const test = require("ava");

var Undertaker = require("../");

var DefaultRegistry = require("undertaker-registry");
var CommonRegistry = require("./fixtures/CommonRegistry.js");
var MetadataRegistry = require("./fixtures/TaskMetadataRegistry.js");

function noop() {  }

function CustomRegistry() {}
CustomRegistry.prototype.init = noop;
CustomRegistry.prototype.get = noop;
CustomRegistry.prototype.set = noop;
CustomRegistry.prototype.tasks = noop;

function SetNoReturnRegistry() {
  this._tasks = {};
}
SetNoReturnRegistry.prototype.init = noop;
SetNoReturnRegistry.prototype.get = function(name) {
  return this.tasks[name];
};
SetNoReturnRegistry.prototype.set = function(name, fn) {
  this.tasks[name] = fn;
};
SetNoReturnRegistry.prototype.tasks = noop;

function InvalidRegistry() {}

test("registry > method > should return the current registry when no arguments are given", function(t) {
  var taker = new Undertaker();
  t.is(taker.registry(), taker._registry);
});

test("registry > method > should set the registry to the given registry instance argument", function(t) {
  var taker = new Undertaker();
  var customRegistry = new CustomRegistry();
  taker.registry(customRegistry);
  t.is(taker.registry(), customRegistry);
});

test("registry > method > should validate the custom registry instance", function(t) {
  var taker = new Undertaker();
  var invalid = new InvalidRegistry();

  function invalidSet() {
    taker.registry(invalid);
  }

  t.throws(invalidSet, { message: "Custom registry must have `get` function" });
});

test("registry > method > should transfer all tasks from old registry to new", function(t) {
  var taker = new Undertaker(new CommonRegistry());
  var customRegistry = new DefaultRegistry();
  taker.registry(customRegistry);

  t.is(typeof taker.task("clean"), "function");
  t.is(typeof taker.task("serve"), "function");
});

test("registry > method > allows multiple custom registries to used", async function(t) {
  t.plan(6);
  var taker = new Undertaker();
  taker.registry(new CommonRegistry());

  t.is(typeof taker.task("clean"), "function");
  t.is(typeof taker.task("serve"), "function");

  taker.registry(new MetadataRegistry());
  taker.task("context", function(cb) {
    t.deepEqual(this, { name: "context" });
    cb();
  });

  taker.registry(new DefaultRegistry());

  t.is(typeof taker.task("clean"), "function");
  t.is(typeof taker.task("serve"), "function");
  t.is(typeof taker.task("context"), "function");

  await new Promise((resolve, reject) => taker.series("context")(err => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  }));
});

test("registry > method > throws with a descriptive method when constructor is passed", function(t) {
  var taker = new Undertaker();

  function ctor() {
    taker.registry(CommonRegistry);
  }

  t.throws(ctor, {
    message:
      "Custom registries must be instantiated, but it looks like you passed a constructor",
  });
});

test("registry > method > calls into the init function after tasks are transferred", function(t) {
  var taker = new Undertaker(new CommonRegistry());

  var ogInit = DefaultRegistry.prototype.init;

  DefaultRegistry.prototype.init = function(inst) {
    t.is(inst, taker);
    t.is(typeof taker.task("clean"), "function");
    t.is(typeof taker.task("serve"), "function");
  };

  taker.registry(new DefaultRegistry());

  DefaultRegistry.prototype.init = ogInit;
});

test("registry > constructor > should take a custom registry on instantiation", function(t) {
  var taker = new Undertaker(new CustomRegistry());
  t.true(taker.registry() instanceof CustomRegistry);
  t.false(taker.registry() instanceof DefaultRegistry);
});

test("registry > constructor > should default to undertaker-registry if not constructed with custom registry", function(t) {
  var taker = new Undertaker();
  t.true(taker.registry() instanceof DefaultRegistry);
  t.false(taker.registry() instanceof CustomRegistry);
});

test("registry > constructor > should take a registry that pre-defines tasks", function(t) {
  var taker = new Undertaker(new CommonRegistry());
  t.true(taker.registry() instanceof CommonRegistry);
  t.true(taker.registry() instanceof DefaultRegistry);
  t.is(typeof taker.task("clean"), "function");
  t.is(typeof taker.task("serve"), "function");
});

test("registry > constructor > should throw upon invalid registry", function(t) {
  /* eslint no-unused-vars: 0 */
  var taker;

  function noGet() {
    taker = new Undertaker(new InvalidRegistry());
  }

  t.throws(noGet, { message: "Custom registry must have `get` function" });
  InvalidRegistry.prototype.get = noop;

  function noSet() {
    taker = new Undertaker(new InvalidRegistry());
  }

  t.throws(noSet, { message: "Custom registry must have `set` function" });
  InvalidRegistry.prototype.set = noop;

  function noInit() {
    taker = new Undertaker(new InvalidRegistry());
  }

  t.throws(noInit, { message: "Custom registry must have `init` function" });
  InvalidRegistry.prototype.init = noop;

  function noTasks() {
    taker = new Undertaker(new InvalidRegistry());
  }

  t.throws(noTasks, { message: "Custom registry must have `tasks` function" });
  InvalidRegistry.prototype.tasks = noop;

  taker = new Undertaker(new InvalidRegistry());
});

test("registry > does not require the `set` method to return a task", async function(t) {
  t.plan(1);
  var taker = new Undertaker();
  taker.registry(new SetNoReturnRegistry());
  taker.task("test", done => done());
  taker.on("start", function(data) {
    t.is(data.name, "test");
  });

  await new Promise((resolve, reject) => taker.series("test")(err => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }

  }));
});

test("registry > should fail and offer tasks which are close in name", function(t) {
  var taker = new Undertaker(new CommonRegistry());
  var customRegistry = new DefaultRegistry();
  taker.registry(customRegistry);

  function fail() {
    taker.series("clear");
  }

  t.throws(fail, {
    message: /Task never defined: clear - did you mean\? clean/,
  });
});
