const debug = require("debug")("rollup-runner");
const generateTask = require("./rollup_runtime");

module.exports = {
  defaultConfig() {
    return {
      // Pass options to uglifyJS, used by both webpack and gulp-uglify
      uglifyJS: { compress: true, sourceMap: true }
    };
  },
  config(config) {
    // Add missing informations to JavaScript configurations
    for (let j in config.js) {
      if (!config.js.hasOwnProperty(j)) {
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
  bundleCreator(crafty) {
    return {
      js: {
        rollup: generateTask
      }
    };
  }
};
