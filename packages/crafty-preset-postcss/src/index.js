const path = require("path");

const getProcessors = require("@swissquote/postcss-swissquote-preset/processors");

const gulpTasks = require("./gulp");

const MODULES = path.join(__dirname, "..", "node_modules");

function resolve(relative) {
  return path.resolve(process.cwd(), relative);
}

function getExtractConfig(bundle) {
  let extractCSSConfig = bundle.extractCSS;
  if (extractCSSConfig === true) {
    extractCSSConfig = {
      filename: "[bundle]-[name].min.css"
    };
  } else if (typeof extractCSSConfig === "string") {
    extractCSSConfig = {
      filename: extractCSSConfig
    };
  }

  // Allow to template [bundle] with the bundle name
  if (typeof extractCSSConfig.filename === "string") {
    extractCSSConfig.filename = extractCSSConfig.filename.replace(
      "[bundle]",
      bundle.name
    );
  }

  return extractCSSConfig;
}

module.exports = {
  defaultConfig() {
    return {
      bundleTypes: { css: "css" },

      // Enable this to be easier on the developer
      legacy_css: false,

      // Stylelint pattern
      stylelint_pattern: [
        "css/**/*.scss",
        "css/**/*.css",
        "!*.min.css",
        "!**/vendor/**/*.scss",
        "!**/vendor/**/*.css",
        "!**/vendor/*.scss",
        "!**/vendor/*.css"
      ],

      // Stylelint modern configuration
      stylelint: {
        plugins: [require.resolve("@swissquote/stylelint-config-swissquote")],
        extends: ["@swissquote/stylelint-config-swissquote/recommended"].map(
          require.resolve
        ),
        rules: {}
      },

      // Stylelint legacy configuration
      stylelint_legacy: {
        extends: ["@swissquote/stylelint-config-swissquote/legacy"].map(
          require.resolve
        ),
        rules: {}
      }
    };
  },
  config(config) {
    // Add missing informations to CSS configurations
    for (let i in config.css) {
      if (!config.css.hasOwnProperty(i)) {
        continue;
      }

      // Store the taskname inside
      config.css[i].name = i;

      // use destination and not filename
      if (config.css[i].filename) {
        config.css[i].destination = config.css[i].filename;
      }

      // Infer default destination if it's not specified
      if (!config.css[i].destination) {
        config.css[i].destination = i + ".min.css";
      }
    }

    return config;
  },
  commands() {
    return {
      cssLint: {
        //eslint-disable-next-line no-unused-vars
        command: function(crafty, input, cli) {
          global.craftyConfig = crafty.config;
          require("./commands/lint_css");
        },
        description: "Lint CSS for errors"
      }
    };
  },
  bundleCreator(crafty) {
    return {
      css: {
        "gulp/postcss": (crafty, bundle, gulp, StreamHandler) => {
          gulp.task(
            bundle.taskName,
            gulpTasks.createTask(crafty, StreamHandler, bundle)
          );

          // Create a watcher for this task if there is a pattern
          if (bundle.watch) {
            crafty.watcher.add(bundle.watch, bundle.taskName);
          }
        }
      }
    };
  },
  gulp(crafty, gulp, StreamHandler) {
    // CSS Linter
    const lintTaskName = "css__lint";
    crafty.watcher.add(crafty.config.stylelint_pattern, lintTaskName);
    gulpTasks.createLinter(gulp, crafty, lintTaskName);
    crafty.addDefaultTask(lintTaskName);
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".css").add(".scss");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // The "style" loader enables hot editing of CSS.
    const styleRule = chain.module.rule("styles").test(/\.s?css$/);

    styleRule.include
      .add(resolve("css"))
      .add(resolve(""))
      .add(resolve("node_modules"));

    if (crafty.getEnvironment() === "production" && bundle.extractCSS) {
      // Initialize extraction plugin
      const MiniCssExtractPlugin = require("mini-css-extract-plugin");

      // Create a list of loaders that also contains the extraction loader
      styleRule.use("style-loader").loader(MiniCssExtractPlugin.loader);

      chain
        .plugin("extractCSS")
        .use(MiniCssExtractPlugin, [getExtractConfig(bundle)]);
    } else {
      styleRule.use("style-loader").loader(require.resolve("style-loader"));
    }

    styleRule
      .use("css-loader")
      .loader(require.resolve("css-loader"))
      .options({
        importLoaders: 1,
        sourceMap:
          crafty.getEnvironment() === "production" && !!bundle.extractCSS
      });

    styleRule
      .use("postcss-loader")
      .loader(require.resolve("postcss-loader"))
      .options({
        parser: require("postcss-scss"),
        plugins: getProcessors(crafty.config, crafty, bundle)
      });
  }
};
