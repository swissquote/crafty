const generateTask = require("./webpack_runtime");

module.exports = {
  presets: [require.resolve("@swissquote/crafty-preset-terser")],
  defaultConfig() {
    return {
      // List of provided libraries, these will not be embedded inside the content
      externals: [],
    };
  },
  config(config) {
    // Add missing informations to JavaScript configurations
    for (const j in config.js) {
      if (!config.js.hasOwnProperty(j)) {
        continue;
      }

      if (!config.js[j].externals) {
        config.js[j].externals = [];
      }

      // Merge global externals into packages
      if (config.externals && config.externals.length) {
        config.externals.forEach((item) => {
          if (config.js[j].externals.indexOf(item) === -1) {
            config.js[j].externals.push(item);
          }
        });
      }
    }

    return config;
  },
  bundleCreator(crafty) {
    return {
      js: {
        webpack: generateTask,
      },
    };
  },
};
