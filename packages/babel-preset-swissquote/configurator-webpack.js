const babelConfigurator = require("./configurator");

/**
 * Cache can be disabled for experimentation and when running Crafty's tests
 * @param {*} crafty
 */
function hasCache(crafty) {
  return (
    crafty.getEnvironment() === "production" &&
    !process.argv.some(arg => arg === "--no-cache") &&
    !process.env.TESTING_CRAFTY
  );
}

module.exports = function(crafty, bundle) {
  const options = babelConfigurator(crafty, bundle, {
    deduplicateHelpers: true,
    useESModules: true
  });

  if (hasCache(crafty)) {
    options.cacheDirectory = true;
  }

  return options;
};
