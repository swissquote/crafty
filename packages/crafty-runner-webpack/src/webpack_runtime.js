const path = require("path");
const fs = require("fs");

const colors = require("@swissquote/crafty-commons/packages/ansi-colors");
const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:runner-webpack"
);

const portFinder = require("./utils/find-port");
const webpackConfigurator = require("./webpack");
const { printStats, printError } = require("./webpack_output");

function prepareConfiguration(crafty, bundle, webpackPort) {
  // Base configuration
  let webpackConfig = webpackConfigurator(crafty, bundle, webpackPort);

  const configPath = path.join(process.cwd(), "webpack.config.js");

  if (fs.existsSync(configPath)) {
    crafty.log(`Merging SQ webpack config with ${colors.magenta(configPath)}`);
    const { merge } = require("../packages/webpack-merge.js");
    webpackConfig = merge(webpackConfig, require(configPath));
  }

  debug("Webpack configuration", webpackConfig);

  return webpackConfig;
}

function extractError(error) {
  if (error instanceof Error) {

    if (error.error.constructor.name === "ESLintError") {
      return {
        type: "information",
        message: error.error.message.replace(/^\[eslint\]/, "")
      };
    }

    return { type: "error", error };
  }

  return { type: "information", message: error.message };
}

/**
 * Prepare execution for both watch and single run
 *
 * @param {Crafty} crafty The crafty instance
 * @param {object} bundle The current bundle's configuration
 * @returns {function(*=)} The gulp task
 */
module.exports = function jsTaskES6(crafty, bundle) {
  const taskName = bundle.taskName;
  const getCompiler = () => {
    return portFinder.getFree(taskName).then(freePort => {
      const config = prepareConfiguration(crafty, bundle, freePort);
      const webpack = require("webpack");
      const compiler = webpack(config);

      if (!compiler) {
        return Promise.reject("Could not create compiler");
      }

      // "invalid" event fires when you have changed a file, and Webpack is
      // recompiling a bundle. WebpackDevServer takes care to pause serving the
      // bundle, so if you refresh, it'll wait instead of serving the old one.
      // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
      compiler.hooks.invalid.tap("CraftyRuntime", () => {
        console.log("Compiling...");
      });

      compiler.hooks.done.tap("CraftyRuntime", stats => {
        printStats(stats, compiler);
      });

      return { compiler, config };
    });
  };

  // This is executed in watch mode only
  crafty.watcher.addRaw({
    start: () => {
      const compilerReady = getCompiler();

      compilerReady.catch(e => {
        crafty.log.error("Could not initialize Webpack configuration", e);
      });

      compilerReady
        .then(({ compiler, config }) => {
          compiler.watch(config.watchOptions, () => {});
        })
        .catch(e => {
          crafty.log.error("Webpack watch: Could not start", e);
        });
    }
  });

  // This is executed in single-run only
  crafty.undertaker.task(taskName, cb => {
    const compilerReady = getCompiler();

    compilerReady.catch(e => {
      cb(e);
    });

    compilerReady
      .then(({ compiler }) => {
        compiler.run((err, stats) => {
          if (err) {

            const extractedError = extractError(err, crafty.Information);

            if (extractedError.type === "information") {
              printError();
              return cb(new crafty.Information(extractedError.message));
            } else if (extractedError.type === "error") {
              return cb(extractedError.error);
            }
          }

          if (stats.compilation.errors && stats.compilation.errors.length) {
            // Those errors are printed by "onDone"
            return cb(new crafty.Information("Webpack compilation failed"));
          }

          return cb();
        });
      })
      .catch(e => {
        printError(e);
        cb(e);
      });
  });
};
