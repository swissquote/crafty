const colors = require("ansi-colors");
const prettyTime = require("pretty-hrtime");

const formatError = require("./formatError");

// Wire up logging events
function logEvents(crafty) {
  const loggedErrors = [];
  crafty.undertaker.on("start", evt => {
    crafty.log.info(`Starting '${colors.cyan(evt.name)}' ...`);
  });
  crafty.undertaker.on("stop", evt => {
    const time = prettyTime(evt.duration);
    crafty.log.info(
      `Finished '${colors.cyan(evt.name)}' after ${colors.magenta(time)}`
    );
  });
  crafty.undertaker.on("error", evt => {
    const time = prettyTime(evt.duration);
    const level = evt.branch ? "info" : "error";
    crafty.log[level](
      `'${colors.cyan(evt.name)}' ${colors.red("errored after")} ${colors.magenta(
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
