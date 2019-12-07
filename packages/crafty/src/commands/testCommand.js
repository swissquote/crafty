const debug = require("debug")("crafty:test");

exports.description = "Run tests from any test runners";
exports.command = function test(crafty, input, cli) {
  debug("Registering Runners");

  const tasks = crafty.getImplementations("test").map(preset => preset.test);

  // Some libraries don't want a NODE_ENV set.
  // We restore the original values here
  process.env.NODE_ENV = crafty.originalEnvironment;

  return new Promise((resolve, reject) => {
    if (tasks.length === 0) {
      console.log("No runner found for tests");
      reject(1);
      return;
    }

    let done = 0;
    let failed = false;
    function finishWhenDone(taskResult) {
      done += 1;
      if (done === tasks.length) {
        if (failed) {
          reject();
        } else {
          resolve(taskResult);
        }
      }
    }

    function failedRunning(e) {
      console.log("Failed running tests", e);
      failed = true;
      finishWhenDone();
    }

    tasks.forEach(task => {
      try {
        task(crafty, input, cli).then(finishWhenDone, failedRunning);
      } catch (e) {
        failedRunning(e);
      }
    });
  });
};
