const merge = require("merge");
const tmp = require("tmp");
const fs = require("fs");
const path = require("path");

const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator");
const createTask = require("./gulp");

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  defaultConfig(config) {
    // For some reason, eslint.CLIEngine doesn't support "extends",
    // it has to be done through a configuration file
    const esConfig = tmp.fileSync({
      prefix: "crafty-config-",
      postfix: ".json"
    }).name;

    fs.writeFileSync(
      esConfig,
      JSON.stringify({ extends: ["plugin:@swissquote/swissquote/recommended"] })
    );

    return {
      bundleTypes: { js: "js" },

      // In case of browser support changes, we prefer having a fixed version
      eslintReactVersion: "15.0",

      // ESLint Override Rules
      eslint: {
        useEslintrc: false,
        plugins: ["@swissquote/swissquote"],
        configFile: esConfig
      },

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
    // Add eslint react version
    config.eslint = merge.recursive(config.eslint, {
      baseConfig: {
        settings: { react: { version: config.eslintReactVersion } }
      }
    });

    return config;
  },
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);
    options.transform["\\.(js|jsx)$"] = require.resolve("./jest-transformer");
    options.moduleFileExtensions.push("jsx");

    options.globals.BABEL_OPTIONS = babelConfigurator(crafty, "test", {});
  },
  commands() {
    return {
      jsLint: {
        //eslint-disable-next-line no-unused-vars
        command: function(crafty, input, cli) {
          global.craftyConfig = crafty.config;
          require("./commands/jsLint");
        },
        description: "Lint JavaScript for errors"
      }
    };
  },
  bundleCreator(crafty) {
    const configurators = { js: {} };

    if (
      crafty.config.loadedPresets.some(
        preset => preset.presetName === "@swissquote/crafty-runner-gulp"
      )
    ) {
      configurators.js["gulp/babel"] = (
        crafty,
        bundle,
        gulp,
        StreamHandler
      ) => {
        gulp.task(bundle.taskName, createTask(crafty, bundle, StreamHandler));
        crafty.watcher.add(bundle.watch || bundle.source, bundle.taskName);
      };
    }

    return configurators;
  },
  rollup(crafty, bundle, rollupConfig) {
    // Add Eslint configuration
    //TODO :: throw error after all files are linted, not after first error
    rollupConfig.input.plugins.eslint = {
      plugin: require("rollup-plugin-eslint").eslint,
      weight: -20,
      options: Object.assign({}, crafty.config.eslint, {
        throwOnError: crafty.getEnvironment() === "production",
        exclude: ["node_modules/**"],
        include: ["**/*.js", "**/*.jsx"]
      })
    };

    const babelOptions = babelConfigurator(
      crafty,
      crafty.getEnvironment() === "production" ? "production" : "development",
      bundle
    );

    // Webpack handles this at the loader level, but Rollup needs it this way.
    babelOptions.exclude = ["node_modules/**"];
    babelOptions.include = ["**/*.js", "**/*.jsx"];

    rollupConfig.input.plugins.babel = {
      plugin: require("rollup-plugin-babel"),
      weight: 20,
      options: babelOptions
    };
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    const options = babelConfigurator(
      crafty,
      crafty.getEnvironment() === "production" ? "production" : "development",
      bundle,
      {
        deduplicateHelpers: true,
        useESModules: true
      }
    );

    // Cache can be disabled for experimentation and when running Crafty's tests
    if (
      crafty.getEnvironment() === "production" &&
      !process.argv.some(arg => arg === "--no-cache") &&
      !process.env.TESTING_CRAFTY
    ) {
      options.cacheDirectory = true;
    }

    // EcmaScript 2015+
    chain.module
      .rule("babel")
      .test(/\.jsx?$/)
      .exclude.add(/(node_modules|bower_components)/)
      .end()
      .use("babel")
      .loader(require.resolve("babel-loader"))
      .options(options);

    // JavaScript linting
    chain.module
      .rule("lint-js")
      .pre()
      .test(/\.jsx?$/)
      .exclude.add(/(node_modules|bower_components)/)
      .end()
      .use("eslint")
      .loader(require.resolve("eslint-loader"))
      .options(crafty.config.eslint);
  }
};
