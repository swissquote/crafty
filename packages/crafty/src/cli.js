const yargs = require("../packages/yargs-parser");
const camelcaseKeys = require("../packages/camelcase-keys");

const hasOwnProperty = Object.prototype.hasOwnProperty;

function parseArguments(args) {
  const argv = yargs(args);

  const input = argv._;
  delete argv._;
  const flags = camelcaseKeys(argv, { exclude: ["--", /^\w$/] });

  return { input, flags };
}

module.exports = function(crafty, commands) {
  const cli = parseArguments(process.argv.slice(2));

  // Make the list of commands available on the crafty object
  crafty.commands = commands;

  // Ensure invocation syntax is valid
  if (!cli.input || cli.input.length < 1) {
    commands.help.command(crafty, [], cli);
    return Promise.resolve(1);
  }

  const [run, ...input] = cli.input;

  // Ensure the command is declared
  if (!hasOwnProperty.call(commands, run)) {
    commands.help.command(crafty, input, cli);
    return Promise.resolve(2);
  }

  const exitCode = commands[run].command(crafty, input, cli);

  // Is a promise
  if (exitCode && exitCode.then) {
    return exitCode;
  }

  return Promise.resolve(exitCode);
};
