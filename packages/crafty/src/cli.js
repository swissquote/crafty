const yargs = require("yargs-parser");
const camelcaseKeys = require("camelcase-keys");

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
  if (!commands.hasOwnProperty(run)) {
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
