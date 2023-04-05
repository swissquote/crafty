const path = require("path");

const { findUpSync } = require("@swissquote/crafty-commons/packages/find-up");

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
      plugin: require("../packages/rollup-plugin-typescript2"),
      weight: 20,
      options: {
        include: [
          "*.ts+(|x)",
          "**/*.ts+(|x)",
          "*.mts",
          "**/*.mts",
          "*.cts",
          "**/*.cts"
        ],
        exclude: [
          "*.d.ts",
          "**/*.d.ts",
          "*.d.cts",
          "**/*.d.cts",
          "*.d.mts",
          "**/*.d.mts"
        ],
        tsconfigOverride: {
          compilerOptions: {
            // Transpile to esnext so that SWC can apply all its magic
            target: "ESNext",
            // Preserve JSX so SWC can optimize it, or add development/debug information
            jsx: "Preserve"
          }
        }
      }
    };

    const {
      getConfigurationRollup
    } = require("@swissquote/crafty-commons-swc/src/configuration.js");
    const options = getConfigurationRollup(crafty, bundle);
    options.extensions = [".ts", ".tsx", ".mts", ".cts"];

    rollupConfig.input.plugins.resolve.options.extensions.push(".mts", ".cts");

    rollupConfig.input.plugins.swcTypeScript = {
      plugin: require("@swissquote/crafty-commons-swc/src/rollup-plugin-swc.js"),
      weight: 30,
      options
    };
  },
  eslint(config, eslint) {
    // This configuration is read by the webpack and rollup plugins
    // The rest of the configuration is handled by `eslint-plugin-swissquote`
    eslint.extensions.push("ts");
    eslint.extensions.push("tsx");
    eslint.extensions.push("mts");
    eslint.extensions.push("cts");

    return eslint;
  },
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);
    options.transform["^.+\\.(ts|tsx|mts|cts)$"] = [
      require.resolve("../packages/ts-jest"),
      {
        compiler: require.resolve("typescript"),
        useESM: false,
        diagnostics: true
      }
    ];

    options.moduleFileExtensions.push("ts");
    options.moduleFileExtensions.push("tsx");
    options.moduleFileExtensions.push("mts");
    options.moduleFileExtensions.push("cts");
  },
  webpack(crafty, bundle, chain) {
    const configFile = findUpSync("tsconfig.json", { cwd: process.cwd() });

    if (!configFile) {
      crafty.log.error(
        `No tsconfig.json found in "${process.cwd()}". Skipping initialization of TypeScript loaders.`
      );
      return;
    }

    const {
      hasSwcHelpersDependency,
      getConfigurationWebpack
    } = require("@swissquote/crafty-commons-swc/src/configuration.js");

    const hasHelperDependency = hasSwcHelpersDependency();

    if (hasHelperDependency) {
      chain.externals(chain.get("externals").concat(/@swc\/helpers/));
    }

    // Make sure this module is resolved from the right path
    chain.resolve.alias.set(
      "@swc/helpers",
      path.dirname(require.resolve("@swc/helpers/package.json"))
    );

    chain.resolve.extensions
      .add(".ts")
      .add(".tsx")
      .add(".mts")
      .add(".cts");

    chain.resolve.extensionAlias
      .set(".js", [".js", ".ts"])
      .set(".cjs", [".cjs", ".cts"])
      .set(".mjs", [".mjs", ".mts"]);

    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    // TypeScript
    const tsRule = chain.module.rule("ts");
    tsRule.test(/\.(ts|tsx|mts|cts)$/);
    tsRule.exclude.add(/(node_modules|bower_components)/);

    // EcmaScript 2015+
    tsRule
      .use("swc")
      .loader(
        require.resolve("@swissquote/crafty-commons-swc/packages/swc-loader.js")
      )
      .options(getConfigurationWebpack(crafty, bundle, hasHelperDependency));

    const tsOptions = {
      // https://webpack.js.org/guides/build-performance/#typescript-loader
      experimentalWatchApi: true,
      compilerOptions: {
        // Transpile to esnext so that SWC can apply all its magic
        target: "ESNext",
        // Preserve JSX so SWC can optimize it, or add development/debug information
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
        .use(require.resolve("../packages/fork-ts-checker-webpack-plugin"), [
          forkCheckerOptions
        ]);
    }

    tsRule
      .use("ts-loader")
      .loader(require.resolve("../packages/ts-loader"))
      .options(tsOptions);
  }
};
