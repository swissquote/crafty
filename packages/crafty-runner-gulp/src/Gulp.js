const EventEmitter = require("events");

const vfs = require("@swissquote/crafty-commons-gulp/packages/vinyl-fs");

function Gulp(crafty) {
  this.crafty = crafty;
  const undertaker = crafty.undertaker;

  // Bind the functions for destructuring
  this.task = undertaker.task.bind(undertaker);
  this.series = undertaker.series.bind(undertaker);
  this.parallel = undertaker.parallel.bind(undertaker);
  this.registry = undertaker.registry.bind(undertaker);
  this.tree = undertaker.tree.bind(undertaker);
  this.lastRun = undertaker.lastRun.bind(undertaker);
}

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.symlink = vfs.symlink;

/**
 * gulp.watch(glob [, opts], tasks)
 * gulp.watch(glob [, opts, cb])
 *
 * @param {String | Array} glob A single glob or array of globs that indicate which files to watch for changes.
 * @param {Object} opt Options that are passed to gaze.
 * @param {Array | Function} task Names of task(s) to run when a file changes, added with gulp.task() or Callback to be called on each change.
 * @return {EventEmitter} EventEmitter that emits change events.
 */
Gulp.prototype.watch = function(glob, opt, task) {
  let options = opt;
  let taskOrCb = task;
  if (
    typeof options === "string" ||
    typeof taskOrCb === "string" ||
    Array.isArray(options) ||
    Array.isArray(taskOrCb)
  ) {
    throw new Error(
      `watching ${glob}: watch task has to be a function (optionally generated by using gulp.parallel or gulp.series)`
    );
  }

  if (typeof options === "function") {
    taskOrCb = options;
    options = {};
  }

  options = options || {};

  let fn;
  if (typeof taskOrCb === "function") {
    fn = this.parallel(taskOrCb);
  }

  // We use an external "proxy" EventEmitter so we
  // don't need to start the real watcher directly.
  const emitter = new EventEmitter();

  this.crafty.watcher.addRaw({
    start: () => {
      this.crafty.log(`Start watching '${glob}'`);
      const watch = require("@swissquote/crafty/src/watch.js");
      watch(glob, options, fn).on("change", event => {
        emitter.emit("change", event);
      });
    }
  });

  return emitter;
};

module.exports = Gulp;
