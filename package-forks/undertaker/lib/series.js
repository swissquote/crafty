var bach = require("bach");

var metadata = require("./helpers/metadata");
var buildTree = require("./helpers/buildTree");
var normalizeArgs = require("./helpers/normalizeArgs");
var createExtensions = require("./helpers/createExtensions");

function series(...tasks) {
  var create = this._settle ? bach.settleSeries : bach.series;

  var args = normalizeArgs(this._registry, tasks);
  var extensions = createExtensions(this);
  var fn = create(args, extensions);
  var name = "<series>";

  metadata.set(fn, {
    name,
    branch: true,
    tree: {
      label: name,
      type: "function",
      branch: true,
      nodes: buildTree(args)
    }
  });
  return fn;
}

module.exports = series;
