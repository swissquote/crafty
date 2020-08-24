const babelConfigurator = require("./configurator");
const getBabelRuntimePath = require("./get-runtime");

module.exports = function (crafty, bundle) {
  const runtimePath = getBabelRuntimePath(bundle);

  const configuratorOptions = {
    deduplicateHelpers: !!runtimePath,
  };

  if (runtimePath) {
    configuratorOptions.runtimeDependency = runtimePath;
  }

  const options = babelConfigurator(crafty, bundle, configuratorOptions);

  // Webpack handles this at the loader level, but Rollup needs it this way.
  options.exclude = ["node_modules/**"];
  options.babelHelpers = runtimePath ? "runtime" : "bundled";

  // We skip preflight checks in the Rollup plugin,
  // since we control the default configuration; we know it works
  options.skipPreflightCheck = true;

  return {
    hasRuntime: !!runtimePath,
    options,
  };
};
