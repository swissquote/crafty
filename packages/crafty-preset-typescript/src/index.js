const path = require("path");

const findUp = require("find-up");

const createTask = require("./gulp");

const MODULES = path.join(__dirname, "..", "node_modules");

// Use another watch mode for TypeScript
// https://blog.johnnyreilly.com/2019/05/typescript-and-high-cpu-usage-watch.html
// https://github.com/Realytics/fork-ts-checker-webpack-plugin/issues/236
// https://github.com/Realytics/fork-ts-checker-webpack-plugin/pull/256
process.env.TSC_WATCHFILE = "UseFsEventsWithFallbackDynamicPolling";

function absolutePath(item) {
  return path.isAbsolute(item) ? item : path.join(process.cwd(), item);
}

module.exports = {
  presets: [require.resolve("@swissquote/crafty-preset-eslint")],
  defaultConfig() {
    return {
      bundleTypes: { js: "js" }
    };
  },
  bundleCreator(crafty) {
    const configurators = { js: {} };

    if (
      crafty.config.loadedPresets.some(
        preset => preset.presetName === "@swissquote/crafty-runner-gulp"
      )
    ) {
      configurators.js["gulp/typescript"] = (
        craftyAgain,
        bundle,
        gulp,
        StreamHandler
      ) => {
        gulp.task(
          bundle.taskName,
          createTask(craftyAgain, bundle, StreamHandler)
        );
        craftyAgain.watcher.add(bundle.watch || bundle.source, bundle.taskName);
      };
    }

    return configurators;
  },
  rollup(crafty, bundle, rollupConfig) {
    rollupConfig.input.plugins.typescript = {
      plugin: require("rollup-plugin-typescript2"),
      weight: 20
    };
  },
  eslint(config, eslint) {
    // This configuration is read by the webpack and rollup plugins
    // The rest of the configuration is handled by `eslint-plugin-swissquote`
    eslint.extensions.push("ts");
    eslint.extensions.push("tsx");

    return eslint;
  },
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);
    options.transform["^.+\\.tsx?$"] = require.resolve("ts-jest");

    options.moduleFileExtensions.push("ts");
    options.moduleFileExtensions.push("tsx");
  },
  webpack(crafty, bundle, chain) {
    const configFile = findUp.sync("tsconfig.json", { cwd: process.cwd() });

    if (!configFile) {
      crafty.log.error(
        `No tsconfig.json found in "${process.cwd()}". Skipping initialization of TypeScript loaders.`
      );
      return;
    }

    chain.resolve.extensions.add(".ts").add(".tsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    // TypeScript
    const tsRule = chain.module.rule("ts");
    tsRule.test(/\.tsx?$/);
    tsRule.exclude.add(/(node_modules|bower_components)/);

    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator");
    const babelOptions = babelConfigurator(
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
      babelOptions.cacheDirectory = true;
    }

    // EcmaScript 2015+
    tsRule
      .use("babel")
      .loader(require.resolve("babel-loader"))
      .options(babelOptions);

    const tsOptions = {
      // https://webpack.js.org/guides/build-performance/#typescript-loader
      experimentalWatchApi: true,
      compilerOptions: {
        // Transpile to esnext so that Babel can apply all its magic
        target: "ESNext",
        // Preserve JSX so babel can optimize it, or add development/debug information
        jsx: "Preserve"
      }
    };

    // Get the current configuration to know what configuration options we have to set
    const compiler = require("typescript");
    const currentConfig = compiler.readConfigFile(
      configFile,
      compiler.sys.readFile
    );

    const hasDeclarations =
      currentConfig.config &&
      currentConfig.config.compilerOptions &&
      currentConfig.config.compilerOptions.declaration;

    if (
      hasDeclarations &&
      !currentConfig.config.compilerOptions.declarationDir
    ) {
      // Write declaration files in the destination folder
      // We set the value this way to respect backwards compatibility,
      // Ideally, the value should be without the `/js` at the end
      tsOptions.compilerOptions.declarationDir = absolutePath(
        `${crafty.config.destination_js +
          (bundle.directory ? `/${bundle.directory}` : "")}/js`
      );
    }

    if (crafty.isPNP) {
      tsOptions.resolveModuleName = require("ts-pnp").resolveModuleName;
    }

    // Fork-ts-webpack checker is enabled only if we don't have declarations enabled in our tsconfig.json
    // https://github.com/Realytics/fork-ts-checker-webpack-plugin/issues/49
    if (!hasDeclarations) {
      tsOptions.transpileOnly = true;

      const forkCheckerOptions = {
        useTypescriptIncrementalApi: true,
        typescript: require.resolve("typescript"),
        compilerOptions: tsOptions.compilerOptions
      };

      if (crafty.isPNP) {
        forkCheckerOptions.resolveModuleNameModule = path.join(
          __dirname,
          "resolvers.js"
        );
        forkCheckerOptions.resolveTypeReferenceDirectiveModule = path.join(
          __dirname,
          "resolvers.js"
        );
      }

      chain
        .plugin("fork-ts-checker")
        .use(require.resolve("fork-ts-checker-webpack-plugin"), [
          forkCheckerOptions
        ]);
    }

    tsRule
      .use("ts-loader")
      .loader(require.resolve("ts-loader"))
      .options(tsOptions);
  }
};
