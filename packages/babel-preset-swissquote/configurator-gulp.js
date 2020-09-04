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

  return babelConfigurator(crafty, bundle, configuratorOptions);
};
