var metadata = require("./metadata");

function buildTree(tasks) {
  return Object.entries(tasks).map(entry => {
    const task = entry[1];
    var meta = metadata.get(task);
    if (meta) {
      return meta.tree;
    }

    var name = task.displayName || task.name || "<anonymous>";
    meta = {
      name,
      tree: {
        label: name,
        type: "function",
        nodes: []
      }
    };

    metadata.set(task, meta);
    return meta.tree;
  });
}

module.exports = buildTree;
