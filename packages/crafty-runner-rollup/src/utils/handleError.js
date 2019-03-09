/*
 ** Taken from https://github.com/rollup/rollup/blob/b949eb08169115ff66648838cbc4833379bf9440/bin/src/logging.js
 ** We might need to keep this up-to-date with new updates of Rollup
 */

const chalk = require("chalk");

const relativeId = require("./relativeId");

// log to stderr to keep `rollup main.js > bundle.js` from breaking
const stderr = console.error.bind(console); // eslint-disable-line no-console

module.exports = function handleError(err, recover) {
  let description = err.message || err;
  if (err.name) {
    description = `${err.name}: ${description}`;
  }
  const message =
    (err.plugin ? `(${err.plugin} plugin) ${description}` : description) || err;

  stderr(chalk.bold.red(`[!] ${chalk.bold(message)}`));

  if (err.url) {
    stderr(chalk.cyan(err.url));
  }

  if (err.loc) {
    stderr(
      `${relativeId(err.loc.file || err.id)} (${err.loc.line}:${
        err.loc.column
      })`
    );
  } else if (err.id) {
    stderr(relativeId(err.id));
  }

  if (err.frame) {
    stderr(chalk.dim(err.frame));
  } else if (err.stack) {
    stderr(chalk.dim(err.stack));
  }

  stderr("");

  if (!recover) {
    process.exit(1);
  }
};
