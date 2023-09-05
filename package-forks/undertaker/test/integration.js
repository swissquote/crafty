"use strict";

const test = require("ava");

var os = require("os");
var fs = require("fs");
var path = require("path");
var vinyl = require("vinyl-fs");
var spawn = require("child_process").spawn;
var once = require("once");
var del = require("del");
var { Transform } = require("streamx");

var Undertaker = require("../");

var isWindows = os.platform() === "win32";

async function cleanup() {
  await del([
    path.join(__dirname, "./fixtures/out/"),
    path.join(__dirname, "./fixtures/tmp/"),
  ]);
}

function noop() {}
var taker;

test.beforeEach(function() {
  taker = new Undertaker();
});

test.beforeEach(cleanup);
test.afterEach(cleanup);

test.serial("should handle vinyl streams", async function(t) {
  t.plan(1);
  taker.task("test", function() {
    return vinyl
      .src("./fixtures/test.js", { cwd: __dirname })
      .pipe(vinyl.dest("./fixtures/out", { cwd: __dirname }));
  });

  await new Promise(resolve =>
    taker.parallel("test")((err) => {

      t.is(err, undefined)

      resolve()
    })
  );
});

test.serial("should exhaust vinyl streams", async function(t) {
  t.plan(1);
  taker.task("test", function() {
    return vinyl.src("./fixtures/test.js", { cwd: __dirname });
  });

  await new Promise(resolve =>
    taker.parallel("test")((err) => {

      t.is(err, undefined)

      resolve()
    })
  );
});

test.serial("should lints all piped files", async function(t) {
  t.plan(2);
  var count = 0;
  taker.task("test", function() {
    return vinyl.src("./fixtures/test.js", { cwd: __dirname }).pipe(
      new Transform({
        transform (file, cb) {
          count++;
          cb();
        }
      })
    );
  });

  await new Promise(resolve =>
    taker.parallel("test")((err) => {
      t.is(count, 1);
      t.is(err, undefined)

      resolve()
    })
  );
});

test.serial("should handle a child process return", async function(t) {
  taker.task("test", function() {
    if (isWindows) {
      return spawn("cmd", ["/c", "dir"]).on("error", noop);
    }

    return spawn("ls", ["-lh", __dirname]);
  });

  await new Promise(resolve =>
    taker.parallel("test")((err, result) => {
      t.is(err, null)

      resolve()
    })
  );
});

test.serial("should run dependencies once", async function(t) {
  t.plan(1);
  var count = 0;

  taker.task(
    "clean",
    once(function() {
      count++;
      return del(["./fixtures/some-build.txt"], { cwd: __dirname });
    })
  );

  taker.task(
    "build-this",
    taker.series("clean", function(cb) {
      cb();
    })
  );
  taker.task(
    "build-that",
    taker.series("clean", function(cb) {
      cb();
    })
  );
  taker.task(
    "build",
    taker.series("clean", taker.parallel(["build-this", "build-that"]))
  );

  await new Promise((resolve, reject) =>
    taker.parallel("build")(function(err) {
      t.is(count, 1);

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});

test.serial("can use lastRun with vinyl.src `since` option", async function(t) {
  t.plan(1);
  var count = 0;

  function setup() {
    return vinyl
      .src("./fixtures/test*.js", { cwd: __dirname })
      .pipe(vinyl.dest("./fixtures/tmp", { cwd: __dirname }));
  }

  function delay(cb) {
    setTimeout(cb, 2000);
  }

  // Some built
  taker.task("build", function() {
    return vinyl
      .src("./fixtures/tmp/*.js", { cwd: __dirname })
      .pipe(vinyl.dest("./fixtures/out", { cwd: __dirname }));
  });

  function userEdit(cb) {
    fs.appendFile(path.join(__dirname, "./fixtures/tmp/testMore.js"), " ", cb);
  }

  function countEditedFiles() {
    return vinyl
      .src("./fixtures/tmp/*.js", {
        cwd: __dirname,
        since: taker.lastRun("build"),
      })
      .pipe(
        new Transform({
          transform (file, cb) {
            count++;
            cb();
          }
        })
      );
  }

  await new Promise((resolve, reject) =>
    taker.series(
      setup,
      delay,
      "build",
      delay,
      userEdit,
      countEditedFiles
    )(function(err) {
      t.is(count, 1);
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  );
});
