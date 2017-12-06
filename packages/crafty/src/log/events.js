const chalk = require("chalk");
const prettyTime = require("pretty-hrtime");

const formatError = require("./formatError");

// Wire up logging events
function logEvents(crafty) {
  const loggedErrors = [];
  crafty.undertaker.on("start", evt => {
    crafty.log.info(`Starting '${chalk.cyan(evt.name)}' ...`);
  });
  crafty.undertaker.on("stop", evt => {
    const time = prettyTime(evt.duration);
    crafty.log.info(
      `Finished '${chalk.cyan(evt.name)}' after ${chalk.magenta(time)}`
    );
  });
  crafty.undertaker.on("error", evt => {
    const time = prettyTime(evt.duration);
    const level = evt.branch ? "info" : "error";
    crafty.log[level](
      `'${chalk.cyan(evt.name)}' ${chalk.red("errored after")} ${chalk.magenta(
        time
      )}`
    );
    // If we haven't logged this before, log it and add to list
    if (loggedErrors.indexOf(evt.error) === -1) {
      crafty.log.error(formatError(evt));
      loggedErrors.push(evt.error);
    }
  });
}
module.exports = logEvents;
