const colors = require("../../packages/ansi-colors");
const prettyTime = require("../../packages/pretty-hrtime");

const formatError = require("./formatError");

const logged = new Set();

function wasLogged(event) {
  if (event.error || event.message) {
    return logged.has(event.error || event.message);
  }

  return false;
}

function recordLogged(event) {
  if (event.error || event.message) {
    logged.add(event.error || event.message);
  }
}

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
    // If we haven't logged this before, log it and add to list
    if (!wasLogged(evt)) {
      crafty.log.error(formatError(evt));
      recordLogged(evt);
    }
  });
}

logEvents.wasLogged = wasLogged;
logEvents.recordLogged = recordLogged;

module.exports = logEvents;
