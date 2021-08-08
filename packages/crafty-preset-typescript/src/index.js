const path = require("path");

const findUp = require("find-up");

const createTask = require("./gulp");

const MODULES = path.join(__dirname, "..", "node_modules");

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
      weight: 20,
      options: {
        tsconfigOverride: {
          compilerOptions: {
            // Transpile to esnext so that Babel can apply all its magic
            target: "ESNext",
            // Preserve JSX so babel can optimize it, or add development/debug information
            jsx: "Preserve"
          }
        }
      }
    };

    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator-rollup");
    const { hasRuntime, options } = babelConfigurator(crafty, bundle);
    options.extensions = [".ts", ".tsx"];

    if (hasRuntime) {
      rollupConfig.input.external.push(/@babel\/runtime/);
    }

    rollupConfig.input.plugins.babelTypeScript = {
      plugin: require("@rollup/plugin-babel"),
      weight: 30,
      options
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
    options.globals["ts-jest"] = {
      compiler: require.resolve("typescript"),
      useESM: false,
      diagnostics: true
    };

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

    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator-webpack");
    const babelOptions = babelConfigurator(crafty, bundle);

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
      const subdirectory = bundle.directory ? `/${bundle.directory}` : "";
      tsOptions.compilerOptions.declarationDir = absolutePath(
        `${crafty.config.destination_js}${subdirectory}/js`
      );
    }

    // Fork-ts-webpack checker is enabled only if we don't have declarations enabled in our tsconfig.json
    // https://github.com/Realytics/fork-ts-checker-webpack-plugin/issues/49
    if (!hasDeclarations) {
      tsOptions.transpileOnly = true;

      const forkCheckerOptions = {
        typescript: {
          typescriptPath: require.resolve("typescript"),
          configOverwrite: {
            compilerOptions: tsOptions.compilerOptions
          }
        }
      };

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
