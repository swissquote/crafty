const generateTask = require("./rollup_runtime");

module.exports = {
  defaultConfig() {
    return {
      // Pass options to uglifyJS, used by both webpack and gulp-uglify
      // We disable most of the compress options as they account for most of the
      // compilation time but only a small amount of the actual size win.
      // whitespace removal and symbol mangling account for around 95% of the size reduction.
      // https://github.com/mishoo/UglifyJS2/tree/master#uglify-fast-minify-mode
      uglifyJS: {
        compress: {
          arrows: false,
          booleans: false,
          collapse_vars: false,
          comparisons: false,
          computed_props: false,
          hoist_funs: false,
          hoist_props: false,
          hoist_vars: false,
          if_return: false,
          inline: false,
          join_vars: false,
          keep_infinity: true,
          loops: false,
          negate_iife: false,
          reduce_funcs: false,
          reduce_vars: false,
          switches: false,
          top_retain: false,
          toplevel: false,
          typeofs: false,

          // Switch off all types of compression except those needed to convince
          // react-devtools that we're using a production build
          // Also we have the minimum to remove dead and unused code correctly
          side_effects: true,
          conditionals: true,
          dead_code: true,
          evaluate: true,
          properties: true,
          unused: true,
          sequences: true
        },
        mangle: true,
        sourceMap: true
      }
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
