"use strict";

const test = require("ava");

var Undertaker = require("../");

var simple = require("./fixtures/taskTree/simple");
var singleLevel = require("./fixtures/taskTree/singleLevel");
var doubleLevel = require("./fixtures/taskTree/doubleLevel");
var tripleLevel = require("./fixtures/taskTree/tripleLevel");
var aliasSimple = require("./fixtures/taskTree/aliasSimple");
var aliasNested = require("./fixtures/taskTree/aliasNested");

function noop(done) {
  done();
}

test("should return a simple tree by default", function(t) {
  var taker = new Undertaker();
  taker.task("test1", function(cb) {
    cb();
  });
  taker.task("test2", function(cb) {
    cb();
  });
  taker.task("test3", function(cb) {
    cb();
  });
  taker.task("error", function(cb) {
    cb();
  });

  var ser = taker.series("test1", "test2");
  var anon = function(cb) {
    cb();
  };
  anon.displayName = "<display name>";

  taker.task("ser", taker.series("test1", "test2"));
  taker.task("par", taker.parallel("test1", "test2", "test3"));
  taker.task("serpar", taker.series("ser", "par"));
  taker.task("serpar2", taker.series(ser, anon));
  taker.task(anon);

  var tree = taker.tree();

  t.deepEqual(tree, simple);
});

test("should form a 1 level tree", function(t) {
  var taker = new Undertaker();
  taker.task("fn1", function(cb) {
    cb();
  });
  taker.task("fn2", function(cb) {
    cb();
  });

  var tree = taker.tree({ deep: true });

  t.deepEqual(tree, singleLevel);
});

test("should form a 2 level nested tree", function(t) {
  var taker = new Undertaker();
  taker.task("fn1", function(cb) {
    cb();
  });
  taker.task("fn2", function(cb) {
    cb();
  });
  taker.task("fn3", taker.series("fn1", "fn2"));

  var tree = taker.tree({ deep: true });

  t.deepEqual(tree, doubleLevel);
});

test("should form a 3 level nested tree", function(t) {
  var taker = new Undertaker();
  taker.task(
    "fn1",
    taker.parallel(function(cb) {
      cb();
    }, noop)
  );
  taker.task(
    "fn2",
    taker.parallel(function(cb) {
      cb();
    }, noop)
  );
  taker.task("fn3", taker.series("fn1", "fn2"));

  var tree = taker.tree({ deep: true });

  t.deepEqual(tree, tripleLevel);
});

test("should use the proper labels for aliased tasks (simple)", function(t) {
  var taker = new Undertaker();
  var anon = function(cb) {
    cb();
  };
  taker.task(noop);
  taker.task("fn1", noop);
  taker.task("fn2", taker.task("noop"));
  taker.task("fn3", anon);
  taker.task("fn4", taker.task("fn3"));

  var tree = taker.tree({ deep: true });

  t.deepEqual(tree, aliasSimple);
});

test("should use the proper labels for aliased tasks (nested)", function(t) {
  var taker = new Undertaker();
  taker.task(noop);
  taker.task("fn1", noop);
  taker.task("fn2", taker.task("noop"));
  taker.task("fn3", function(cb) {
    cb();
  });
  taker.task(
    "ser",
    taker.series(
      noop,
      function(cb) {
        cb();
      },
      "fn1",
      "fn2",
      "fn3"
    )
  );
  taker.task(
    "par",
    taker.parallel(
      noop,
      function(cb) {
        cb();
      },
      "fn1",
      "fn2",
      "fn3"
    )
  );

  var tree = taker.tree({ deep: true });

  t.deepEqual(tree, aliasNested);
});
