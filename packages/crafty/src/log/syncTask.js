const colors = require("ansi-colors");

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
      colors.red("The following tasks did not complete:"),
      colors.cyan(taskNames)
    );
    crafty.log.warn(colors.red("Did you forget to signal async completion?"));
  });
  crafty.undertaker.on("start", start);
  crafty.undertaker.on("stop", clear);
  crafty.undertaker.on("error", clear);
}

module.exports = logSyncTask;
