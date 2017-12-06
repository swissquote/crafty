const meow = require("meow");

const help = require("./help");

module.exports = function cli(crafty, commands) {
  const cli = meow("", {});

  // Ensure invocation syntax is valid
  if (!cli.input || cli.input.length < 1) {
    console.log(help(commands, crafty));
    process.exit(1);
  }

  const run = cli.input[0];

  // Ensure the command is declared
  if (!commands.hasOwnProperty(run)) {
    console.log(help(commands, crafty));
    process.exit(2);
  }

  const exitCode = commands[run].command(crafty, cli.input.slice(1), cli);

  // Is a promise
  if (exitCode && exitCode.then) {
    return exitCode;
  }

  return Promise.resolve(exitCode);
};
