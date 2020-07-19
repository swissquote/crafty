/* global jest, describe, it, beforeEach, afterEach, afterAll */
/* eslint-disable @swissquote/swissquote/sonarjs/no-identical-functions */
const fs = require("fs");
const path = require("path");

const expect = require("expect");
const rimraf = require("rimraf");
const through = require("through2");
const normalizePath = require("normalize-path");

const watch = require("../watch");

// Default delay on debounce
const timeout = 200;

describe("glob-watcher", () => {
  let watcher;

  const outDir = path.join(__dirname, "./fixtures/");
  const outFile1 = path.join(outDir, "changed.js");
  const outFile2 = path.join(outDir, "added.js");
  const globPattern = "**/*.js";
  const outGlob = normalizePath(path.join(outDir, globPattern));
  const singleAdd = normalizePath(path.join(outDir, "changed.js"));
  const ignoreGlob = `!${singleAdd}`;

  function changeFile() {
    fs.writeFileSync(outFile1, "hello changed");
  }

  function addFile() {
    fs.writeFileSync(outFile2, "hello added");
  }

  beforeEach(cb => {
    fs.mkdirSync(outDir);
    fs.writeFileSync(outFile1, "hello world");
    cb();
  });

  afterEach(cb => {
    if (watcher) {
      watcher.close();
    }
    rimraf(outDir, cb);
  });

  afterAll(cb => {
    rimraf(outDir, cb);
  });

  it("only requires a glob and returns watcher", done => {
    watcher = watch(outGlob);

    watcher.once("change", filepath => {
      expect(filepath).toEqual(outFile1);
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("picks up added files", done => {
    watcher = watch(outGlob);

    watcher.once("add", filepath => {
      expect(filepath).toEqual(outFile2);
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", addFile);
  });

  it("works with OS-specific cwd", done => {
    watcher = watch(`./fixtures/${globPattern}`, { cwd: __dirname });

    watcher.once("change", filepath => {
      // Uses path.join here because the resulting path is OS-specific
      expect(filepath).toEqual(path.join("fixtures", "changed.js"));
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("accepts a callback & calls when file is changed", done => {
    watcher = watch(outGlob, cb => {
      cb();
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("accepts a callback & calls when file is added", done => {
    watcher = watch(outGlob, cb => {
      cb();
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", addFile);
  });

  it("waits for completion is signaled before running again", done => {
    let runs = 0;

    watcher = watch(outGlob, cb => {
      runs++;
      if (runs === 1) {
        setTimeout(() => {
          expect(runs).toEqual(1);
          cb();
        }, timeout * 3);
      }
      if (runs === 2) {
        cb();
        done();
      }
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", () => {
      changeFile();
      // Fire after double the delay
      setTimeout(changeFile, timeout * 2);
    });
  });

  // It can signal completion with anything async-done supports
  // Just wanted to have a smoke test for streams
  it("can signal completion with a stream", done => {
    let runs = 0;

    // eslint-disable-next-line consistent-return
    watcher = watch(outGlob, cb => {
      runs++;
      if (runs === 1) {
        const stream = through();
        setTimeout(() => {
          expect(runs).toEqual(1);
          stream.end();
        }, timeout * 3);
        return stream;
      }
      if (runs === 2) {
        cb();
        done();
      }
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", () => {
      changeFile();
      // Fire after double the delay
      setTimeout(changeFile, timeout * 2);
    });
  });

  it("emits an error if one occurs in the callback and handler attached", done => {
    const expectedError = new Error("boom");

    watcher = watch(outGlob, cb => {
      cb(expectedError);
    });

    watcher.on("error", err => {
      expect(err).toEqual(expectedError);
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("does not emit an error (and crash) when no handlers attached", done => {
    const expectedError = new Error("boom");

    watcher = watch(outGlob, cb => {
      cb(expectedError);
      setTimeout(done, timeout * 3);
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("allows the user to disable queueing", done => {
    let runs = 0;

    watcher = watch(outGlob, { queue: false }, cb => {
      runs++;
      setTimeout(() => {
        // Expect 1 because run 2 is never queued
        expect(runs).toEqual(1);
        cb();
        done();
      }, timeout * 3);
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", () => {
      changeFile();
      // This will never trigger a call because queueing is disabled
      setTimeout(changeFile, timeout * 2);
    });
  });

  it("allows the user to adjust delay", done => {
    let runs = 0;

    watcher = watch(outGlob, { delay: timeout / 2 }, cb => {
      runs++;
      if (runs === 1) {
        setTimeout(() => {
          expect(runs).toEqual(1);
          cb();
        }, timeout * 3);
      }
      if (runs === 2) {
        expect(runs).toEqual(2);
        cb();
        done();
      }
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", () => {
      changeFile();
      // This will queue because delay is halved
      setTimeout(changeFile, timeout);
    });
  });

  it("passes options to chokidar", done => {
    // Callback is called while chokidar is discovering file paths
    // if ignoreInitial is explicitly set to false and passed to chokidar
    watcher = watch(outGlob, { ignoreInitial: false }, cb => {
      cb();
      done();
    });
  });

  it("does not override default values with null values", done => {
    watcher = watch(outGlob, { ignoreInitial: null }, cb => {
      cb();
      done();
    });

    // We default `ignoreInitial` to true and it isn't overwritten by null
    // So wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("watches exactly the given event", done => {
    const spy = jest.fn().mockImplementation(cb => {
      cb();
      spy.mockImplementation(
        () => new Error("`Add` handler called for `change` event")
      );
      setTimeout(done, 500);
      changeFile();
    });

    watcher = watch(outGlob, { events: "add" }, spy);

    watcher.on("ready", addFile);
  });

  it("accepts multiple events to watch", done => {
    const spy = jest
      .fn()
      .mockImplementation(
        () => new Error("`Add`/`Unlink` handler called for `change` event")
      );

    watcher = watch(outGlob, { events: ["add", "unlink"] }, spy);

    watcher.on("ready", () => {
      changeFile();
      setTimeout(done, 500);
    });
  });

  it("can ignore a glob after it has been added", done => {
    watcher = watch([outGlob, ignoreGlob]);

    watcher.once("change", filepath => {
      // It should never reach here
      expect(filepath).toNotExist();
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);

    setTimeout(done, 1500);
  });

  it("can re-add a glob after it has been negated", done => {
    watcher = watch([outGlob, ignoreGlob, singleAdd]);

    watcher.once("change", filepath => {
      expect(filepath).toEqual(singleAdd);
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);
  });

  it("does not mutate the globs array", done => {
    const globs = [outGlob, ignoreGlob, singleAdd];
    watcher = watch(globs);

    expect(globs[0]).toEqual(outGlob);
    expect(globs[1]).toEqual(ignoreGlob);
    expect(globs[2]).toEqual(singleAdd);

    done();
  });

  it("passes ignores through to chokidar", done => {
    const ignored = [singleAdd];
    watcher = watch(outGlob, {
      ignored
    });

    watcher.once("change", filepath => {
      // It should never reach here
      expect(filepath).toNotExist();
      done();
    });

    // We default `ignoreInitial` to true, so always wait for `on('ready')`
    watcher.on("ready", changeFile);

    // Just test the non-mutation in this test
    expect(ignored.length).toEqual(1);

    setTimeout(done, 1500);
  });
});
