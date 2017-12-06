function makeSpaces(length) {
  let i = 0;
  let result = "";
  while (i < length) {
    result += " ";
    i++;
  }
  return result;
}
function describeCommands(descriptions, padding) {
  return Object.keys(descriptions)
    .map(
      command =>
        makeSpaces(2) +
        command +
        makeSpaces(2 + padding - command.length) +
        descriptions[command].description
    )
    .join("\n");
}
function describeTasks(undertaker) {
  const tree = undertaker.tree();
  return tree.nodes.length
    ? makeSpaces(2) + tree.nodes.join("\n" + makeSpaces(2)).trim()
    : makeSpaces(2) + "No task defined";
}

module.exports = function(commands, crafty) {
  crafty.createTasks();
  const padding = Object.keys(commands)
    .map(string => string.length)
    .reduce((max, length) => Math.max(max, length), 0);
  return `
Usage:
  $ crafty <command>

Commands:
${describeCommands(commands, padding)}

Tasks:
${describeTasks(crafty.undertaker)}
`;
};
