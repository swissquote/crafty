const hasOwnProperty = Object.prototype.hasOwnProperty;

const generateTask = require("./webpack_runtime");

module.exports = {
  presets: [require.resolve("@swissquote/crafty-preset-terser")],
  defaultConfig() {
    return {
      // Declare the Js bundle type here as well as we could use webpack without SWC or Babel
      bundleTypes: { js: "js" },

      // List of provided libraries, these will not be embedded inside the content
      externals: []
    };
  },
  config(config) {
    // Add missing informations to JavaScript configurations
    for (const j in config.js) {
      if (!hasOwnProperty.call(config.js, j)) {
        continue;
      }

      if (!config.js[j].externals) {
        config.js[j].externals = [];
      }

      // Merge global externals into packages
      if (config.externals && config.externals.length) {
        config.externals.forEach(item => {
          if (config.js[j].externals.indexOf(item) === -1) {
            config.js[j].externals.push(item);
          }
        });
      }
    }

    return config;
  },
  bundleCreator(/* crafty */) {
    return {
      js: {
        webpack: generateTask
      }
    };
  }
};
