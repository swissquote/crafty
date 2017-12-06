const chalk = require("chalk");

const tasks = {};

function start(e) {
  tasks[e.uid] = e.name;
}

function clear(e) {
  delete tasks[e.uid];
}

function logSyncTask(crafty) {
  process.once("exit", () => {
    const taskKeys = Object.keys(tasks);
    if (!taskKeys.length) {
      return;
    }
    const taskNames = taskKeys.map(key => tasks[key]).join(", ");
    crafty.log.warn(
      chalk.red("The following tasks did not complete:"),
      chalk.cyan(taskNames)
    );
    crafty.log.warn(chalk.red("Did you forget to signal async completion?"));
  });
  crafty.undertaker.on("start", start);
  crafty.undertaker.on("stop", clear);
  crafty.undertaker.on("error", clear);
}

module.exports = logSyncTask;
