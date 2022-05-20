var bach = require("@swissquote/bach");

var metadata = require("./helpers/metadata");
var buildTree = require("./helpers/buildTree");
var normalizeArgs = require("./helpers/normalizeArgs");
var createExtensions = require("./helpers/createExtensions");

function parallel(...tasks) {
  var create = this._settle ? bach.settleParallel : bach.parallel;

  var args = normalizeArgs(this._registry, tasks);
  var extensions = createExtensions(this);
  var fn = create(args, extensions);
  var name = "<parallel>";

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

module.exports = parallel;
