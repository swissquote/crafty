const debug = require("debug")("crafty:commands");
const merge = require("merge");

function getCommands(crafty) {
  debug("Registering Commands");
  let commands = {};
  crafty.getImplementations("commands").forEach((preset) => {
    debug(`${preset.presetName}.commands(crafty)`);
    commands = merge.recursive(true, commands, preset.commands(crafty));
  });
  commands.help = require("./help.js");
  commands.run = require("./run.js");
  commands.watch = require("./watch.js");
  commands.test = require("./testCommand.js");
  commands.ide = require("./ide.js");
  commands.browsers = require("./browsers.js");

  return commands;
}

module.exports = getCommands;
