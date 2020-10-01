const babelConfigurator = require("./configurator");

/**
 * Cache can be disabled for experimentation and when running Crafty's tests
 * @param {*} crafty 
 */
function hasCache(crafty) {
  return crafty.getEnvironment() === "production" &&
    !process.argv.some(arg => arg === "--no-cache") &&
    !process.env.TESTING_CRAFTY
}

module.exports = function(crafty, bundle) {
  const options = babelConfigurator(crafty, bundle, {
    deduplicateHelpers: true,
    useESModules: true
  });

  // This plugin is needed to rewrite babel imports as they don't have an extension appended
  // It can be removed after switching to Babel 8
  // https://github.com/babel/babel/issues/8462
  options.plugins.push(
    require.resolve("./transform-runtime-extensions-outside.js")
  );
  
  if (hasCache(crafty)) {
    options.cacheDirectory = true;
  }

  return options;
};

// This plugin is needed to rewrite babel imports as they don't have an extension appended
// It can be removed after switching to Babel 8
// https://github.com/babel/babel/issues/8462
module.exports.runtimeLoaderConfiguration = function(crafty, bundle) {
  const options = {
    plugins: [
      require.resolve("./transform-runtime-extensions-inside.js")
    ]
  };

  if (hasCache(crafty)) {
    options.cacheDirectory = true;
  }

  return options;
}
