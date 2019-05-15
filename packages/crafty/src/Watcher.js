const colors = require("ansi-colors");

const run = require("./commands/run");

function listTasks(tasks) {
  return tasks.map(item => `'${colors.cyan(item)}'`).join(", ");
}

class Watcher {
  constructor(crafty) {
    this.watchers = {};
    this.rawWatchers = [];
    this.crafty = crafty;
  }
  add(regex, task) {
    if (this.watchers.hasOwnProperty(regex)) {
      this.watchers[regex].tasks.push(task);
      return;
    }
    this.watchers[regex] = {
      tasks: [task],
      start: () => {
        const tasks = this.watchers[regex].tasks;
        const parallelRun = this.crafty.undertaker.parallel(tasks);
        this.crafty.log(
          `Start watching '${regex}' running`,
          listTasks(tasks),
          "on change"
        );
        this.runOnce = this.runOnce.concat(tasks);
        const watch = require("glob-watcher");
        this.watchers[regex].running = watch(regex, {}, parallelRun);
      }
    };
  }
  addRaw(runner) {
    this.rawWatchers.push(runner);
  }
  run() {
    process.on("SIGINT", () => {
      this.crafty.log("Stopping watch");
      process.exit();
    });

    this.runOnce = [];

    Object.keys(this.watchers).forEach(watcher =>
      this.watchers[watcher].start()
    );

    this.rawWatchers.forEach(watcher => watcher.start());

    if (this.runOnce.length) {
      this.crafty.log("First run on watch tasks:", listTasks(this.runOnce));
      run.command(this.crafty, this.runOnce).catch(e => {
        this.crafty.log("An error occured while running tasks", e);
      });
    }
  }
}

module.exports = Watcher;
