const meow = require("meow");

module.exports = async function(crafty, commands) {
  const cli = meow("", {});

  // Make the list of commands available on the crafty object
  crafty.commands = commands;

  // Ensure invocation syntax is valid
  if (!cli.input || cli.input.length < 1) {
    commands.help.command(crafty, cli.input.slice(1), cli);
    return 1;
  }

  const run = cli.input[0];

  // Ensure the command is declared
  if (!commands.hasOwnProperty(run)) {
    commands.help.command(crafty, cli.input.slice(1), cli);
    return 2;
  }

  return commands[run].command(crafty, cli.input.slice(1), cli);
};
