module.exports = {
  defaultConfig(config) {
    return {
      // Pass options to Terser, used by all runners
      // We disable most of the compress options as they account for most of the
      // compilation time but only a small amount of the actual size win.
      // whitespace removal and symbol mangling account for around 95% of the size reduction.
      // https://github.com/terser/terser#terser-fast-minify-mode
      terser: {
        compress: {
          // Disable the most costly transforms
          arrows: false,
          collapse_vars: false,
          comparisons: false,
          computed_props: false,
          hoist_funs: false,
          hoist_props: false,
          hoist_vars: false,
          if_return: false,
          join_vars: false,
          loops: false,
          negate_iife: false,
          reduce_vars: false,
          switches: false,
          top_retain: false,
          toplevel: false,
          typeofs: false,

          // Enable some others
          keep_infinity: true,
          inline: 1,

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
  }
};
