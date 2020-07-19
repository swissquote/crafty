const merge = require("merge");
const path = require("path");

const { configurationBuilder, stringifyConfiguration, toTempFile } = require("./eslintConfigurator");

const debug = require("debug")("crafty:preset-eslint");

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  presets: [require.resolve("@swissquote/crafty-preset-prettier")],
  defaultConfig(config) {
    return {
      // ESLint Override Rules
      eslint: {
        extends: ["plugin:@swissquote/swissquote/recommended"],
        plugins: ["@swissquote/swissquote"]
      }
    };
  },
  config(config) {
    // Add eslint react version
    const eslintConfig = Object.assign({}, config.eslint);

    let extendedEslintConfig = {
      config: eslintConfig,
      extensions: ["js", "jsx"]
    };

    // Apply overrides to clean up configuration
    config.loadedPresets
      .filter(preset => preset.eslint)
      .forEach(preset => {
        debug(preset.presetName + ".eslint(config, eslint)");
        if (typeof preset.eslint == "function") {
          extendedEslintConfig = preset.eslint(config, extendedEslintConfig);
        } else {
          extendedEslintConfig.config = merge.recursive(
            extendedEslintConfig.config,
            preset.eslint
          );
        }
      });

    config.eslintExtensions = extendedEslintConfig.extensions;
    config.eslint = extendedEslintConfig.config;

    return config;
  },
  ide(crafty) {
    global.craftyConfig = crafty.config;

    return {
      ".eslintrc.js": {
        content: configurationBuilder(process.argv).configuration,
        serializer: stringifyConfiguration
      }
    };
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
  rollup(crafty, bundle, rollupConfig) {
    // Add Eslint configuration
    rollupConfig.input.plugins.eslint = {
      plugin: require("@swissquote/rollup-plugin-eslint"),
      weight: -20,
      options: {
        overrideConfigFile: toTempFile(crafty.config.eslint),
        throwOnError: crafty.getEnvironment() === "production",
        exclude: ["node_modules/**"],
        include: crafty.config.eslintExtensions.map(
          extension => new RegExp(`\.${extension}$`)
        )
      }
    };
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    const extensions = crafty.config.eslintExtensions;

    // JavaScript linting
    chain.module
      .rule("lint-js")
      .pre()
      .test(new RegExp(`\\.(${extensions.join("|")})$`))
      .exclude.add(/(node_modules|bower_components)/)
      .end()
      .use("eslint")
      .loader(require.resolve("eslint-loader"))
      .options({
        configFile: toTempFile(crafty.config.eslint)
      });
  }
};
