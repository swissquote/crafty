var metadata = require("./helpers/metadata");

function tree(rawOpts) {
  const opts = Object.assign(
    {
      deep: false
    },
    rawOpts || {}
  );

  var tasks = this._registry.tasks();
  var nodes = Object.entries(tasks).map(entry => {
    var meta = metadata.get(entry[1]);

    if (opts.deep) {
      return meta.tree;
    }

    return meta.tree.label;
  });

  return {
    label: "Tasks",
    nodes
  };
}

module.exports = tree;
