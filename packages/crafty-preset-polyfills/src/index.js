const { join } = require("path");

const MODULES = join(__dirname, "node_modules");

function includePolyfills(bundle) {
  // True by default
  if (!bundle.hasOwnProperty("polyfills")) {
    return true;
  }

  return bundle.polyfills;
}

module.exports = {
  webpack(crafty) {
    crafty.config.resolve.modules.add(MODULES);
    crafty.config.resolveLoader.modules.add(MODULES);

    // Include the polyfills if needed
    if (includePolyfills(crafty.sqGulp.bundle)) {
      crafty.config.entry("default").prepend(require.resolve("./polyfills.js"));
    }
  }
};
