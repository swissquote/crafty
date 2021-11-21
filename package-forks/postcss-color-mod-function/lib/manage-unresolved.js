module.exports = function manageUnresolved(node, opts, word, message) {
  if (opts.unresolved === "warn") {
    opts.decl.warn(opts.result, message, { word });
  } else if (opts.unresolved !== "ignore") {
    throw opts.decl.error(message, { word });
  }
};
