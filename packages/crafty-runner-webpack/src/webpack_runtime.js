const path = require("path");
const fs = require("fs");

const colors = require("@swissquote/crafty/packages/ansi-colors");
const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:runner-webpack"
);

const portFinder = require("./utils/find-port");
const webpackConfigurator = require("./webpack");
const webpackOutput = require("./webpack_output");

function prepareConfiguration(crafty, bundle, webpackPort) {
  // Base configuration
  let webpackConfig = webpackConfigurator(crafty, bundle, webpackPort);

  const configPath = path.join(process.cwd(), "webpack.config.js");

  if (fs.existsSync(configPath)) {
    crafty.log(`Merging SQ webpack config with ${colors.magenta(configPath)}`);
    const { merge } = require("webpack-merge");
    webpackConfig = merge(webpackConfig, require(configPath));
  }

  debug("Webpack configuration", webpackConfig);

  return webpackConfig;
}

// Print out errors
function printError(summary, error) {
  console.log(summary);
  console.log();
  console.log(error);
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
        webpackOutput(stats, compiler);
      });

      return { compiler, config };
    });
  };

  // This is executed in watch mode only
  let runningWatcher = null;
  crafty.watcher.addRaw({
    start: () => {
      const compilerReady = getCompiler();

      compilerReady.catch(e => {
        crafty.log.error("[webpack-dev-server]", "Could not initialize", e);
      });

      compilerReady
        .then(({ compiler, config }) => {
          // Prepare the Hot Reload Server
          const WebpackDevServer = require("webpack-dev-server");
          runningWatcher = new WebpackDevServer(config.devServer, compiler);

          runningWatcher.startCallback(err => {
            if (err) {
              throw err;
            }
            crafty.log(
              "[webpack-dev-server]",
              `Started, listening on ${config.devServer.host}:${config.devServer.port}`
            );
          });
        })
        .catch(e => {
          crafty.log.error("[webpack-dev-server]", "Could not start", e);
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
            if (err instanceof Error) {
              return cb(err);
            } else {
              printError("Failed to compile.", err);
              return cb(new crafty.Information("Webpack compilation failed"));
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
        printError("Failed to compile.", e);
        cb(e);
      });
  });
};
