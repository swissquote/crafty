const path = require("path");

const { createGlobalRule, createModuleRule } = require("./webpack-utils");

const MODULES = path.join(__dirname, "..", "node_modules");
const hasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = {
  presets: [require.resolve("@swissquote/crafty-preset-stylelint")],
  defaultConfig() {
    return {
      bundleTypes: { css: "css" }
    };
  },
  config(config) {
    // Add missing informations to CSS configurations
    for (const i in config.css) {
      if (!hasOwnProperty.call(config.css, i)) {
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
        config.css[i].destination = `${i}.min.css`;
      }
    }

    return config;
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".css").add(".scss");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    createGlobalRule(crafty, bundle, chain);
    createModuleRule(crafty, bundle, chain);

    // ADD Minify plugin
    chain.optimization
      .minimizer("css")
      .use(path.resolve(__dirname, "minify.js"), [
        {
          targets: crafty.config.browsers,
          drafts: {
            customMedia: true
          },
          implementation: require("lightningcss")
        }
      ]);
  }
};
