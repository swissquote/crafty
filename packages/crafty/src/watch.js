/*
 * Taken from https://github.com/gulpjs/glob-watcher/pull/42/
 * as glob-watcher will not be upgraded for the forseeable future
 */

const chokidar = require("../packages/chokidar");
const debounce = require("../packages/just-debounce");
const asyncDone = require("../packages/async-done");
const isNegatedGlob = require("../packages/is-negated-glob");
const anymatch = require("../packages/anymatch");

const defaultOpts = {
  delay: 200,
  events: ["add", "change", "unlink"],
  ignored: [],
  ignoreInitial: true,
  queue: true
};

function listenerCount(ee, evtName) {
  if (typeof ee.listenerCount === "function") {
    return ee.listenerCount(evtName);
  }

  return ee.listeners(evtName).length;
}

function hasErrorListener(ee) {
  return listenerCount(ee, "error") !== 0;
}

function getPattern(val) {
  return val.pattern;
}

/* eslint-disable no-param-reassign */
function watch(glob, options, cb) {
  if (typeof options === "function") {
    cb = options;
    options = {};
  }

  if (Array.isArray(glob)) {
    // We slice so we don't mutate the passed globs array
    glob = glob.slice();
  } else {
    glob = [glob];
  }
  /* eslint-enable no-param-reassign */

  const opt = { ...defaultOpts, ...options };

  if (!Array.isArray(opt.events)) {
    opt.events = [opt.events];
  }

  let queued = false;
  let running = false;

  const positives = [];
  const negatives = [];

  // Reverse the glob here so we don't end up with a positive
  // and negative glob in position 0 after a reverse
  glob.reverse().forEach((globString, index) => {
    const result = isNegatedGlob(globString);
    const obj = { pattern: result.pattern, index };
    (result.negated ? negatives : positives).push(obj);
  });

  const toWatch = positives.map(getPattern);

  function shouldBeIgnored(path) {
    const negativeMatch = anymatch(negatives.map(getPattern), path, true);
    // If negativeMatch is -1, that means it was never negated
    if (negativeMatch === -1) {
      return false;
    }

    const positiveMatch = anymatch(toWatch, path, true);

    // If we have a negative match but never had a positive match
    // it should be ignored
    if (positiveMatch === -1 && negativeMatch !== -1) {
      return true;
    }

    // If the negative is "less than" the positive, that means
    // it came later in the glob array before we reversed them
    return negatives[negativeMatch].index < positives[positiveMatch].index;
  }

  // We only do add our custom `ignored` if there are some negative globs
  if (negatives.length) {
    opt.ignored = [].concat(opt.ignored, shouldBeIgnored);
  }
  const watcher = chokidar.watch(toWatch, opt);

  function runComplete(err) {
    running = false;

    if (err && hasErrorListener(watcher)) {
      watcher.emit("error", err);
    }

    // If we have a run queued, start onChange again
    if (queued) {
      queued = false;
      /* eslint-disable no-use-before-define */
      onChange();
    }
  }

  function onChange() {
    if (running) {
      if (opt.queue) {
        queued = true;
      }
      return;
    }

    running = true;
    asyncDone(cb, runComplete);
  }

  let fn;
  if (typeof cb === "function") {
    fn = debounce(onChange, opt.delay);
  }

  function watchEvent(eventName) {
    watcher.on(eventName, fn);
  }

  if (fn) {
    opt.events.forEach(watchEvent);
  }

  return watcher;
}

module.exports = watch;
