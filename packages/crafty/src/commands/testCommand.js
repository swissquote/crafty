const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:test"
);

const formatError = require("../log/formatError");

exports.description = "Run tests from any test runners";
exports.command = function test(crafty, input, cli) {
  debug("Registering Runners");

  const runners = crafty.getImplementations("test");
  const tasks = runners.map(preset => preset.get("test"));

  // Restore the original NODE_ENV, or "test" like `crafty ide` (undefined would set "undefined")
  process.env.NODE_ENV = crafty.originalEnvironment ?? "test";

  return new Promise((resolve, reject) => {
    if (tasks.length === 0) {
      console.log("No runner found for tests");
      reject(1);
      return;
    }

    if (tasks.length > 1) {
      reject(
        new crafty.Information(
          `You have multiple test runners, please configure exactly one. Available runners are ['${runners
            .map(preset => preset.presetName)
            .join("', '")}'].`
        )
      );
      return;
    }

    let done = 0;
    let failed = false;
    function finishWhenDone(taskResult) {
      done += 1;
      if (done === tasks.length) {
        if (failed) {
          reject(
            new crafty.Information(
              "crafty test: One or more test runners failed"
            )
          );
        } else {
          resolve(taskResult);
        }
      }
    }

    function failedRunning(e) {
      console.error(formatError(e));
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
