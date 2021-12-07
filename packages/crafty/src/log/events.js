const colors = require("../../packages/ansi-colors");
const prettyTime = require("../../packages/pretty-hrtime");

// Wire up logging events
function logEvents(crafty) {
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
      `'${colors.cyan(evt.name)}' ${colors.red(
        "errored after"
      )} ${colors.magenta(time)}`
    );
    crafty.error(evt.error);
  });
}

module.exports = logEvents;
