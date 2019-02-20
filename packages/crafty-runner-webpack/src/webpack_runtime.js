const path = require("path");
const fs = require("fs");

const chalk = require("chalk");

const mkdirp = require("mkdirp");
const debug = require("debug")("crafty-runner-webpack");

const portFinder = require("./utils/find-port");
const webpackConfigurator = require("./webpack");
const webpackOutput = require("./webpack_output");

function prepareConfiguration(crafty, bundle, webpackPort) {
  // Base configuration
  let webpackConfig = webpackConfigurator(crafty, bundle, webpackPort);

  const configPath = path.join(process.cwd(), "webpack.config.js");

  if (fs.existsSync(configPath)) {
    crafty.log("Merging SQ webpack config with " + chalk.magenta(configPath));
    const webpackMerge = require("webpack-merge");
    webpackConfig = webpackMerge.smart(webpackConfig, require(configPath));
  }

  debug("Webpack configuration", webpackConfig);

  return webpackConfig;
}

function copyToDisk(stats, compiler) {
  Object.keys(stats.compilation.assets)
  .map(key => stats.compilation.assets[key])
  .filter(asset => asset.emitted)
  .forEach(asset => {
    const file = asset.existsAt;
    compiler.outputFileSystem.readFile(file, (err, result) => {
      if (err) {
        throw err;
      }

      mkdirp.sync(path.dirname(file));

      fs.writeFile(file, result, err2 => {
        if (err2) {
          throw err2;
        }
      });
    });
  });
}

// Print out errors
function printErrors(summary, errors) {
  console.log(summary);
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
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

      compiler.hooks.done.tap(
        "CraftyRuntime",
        stats => {
          // If we are in watch mode, the bundle is only generated in memory
          // This will copy it to disk, to make refreshes work fine
          // as we don't use the dev-server as a proxy
          if (crafty.isWatching()) {
            copyToDisk(stats, compiler)
          }
      
          webpackOutput(stats, compiler);
        }
      );

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
          runningWatcher = new WebpackDevServer(compiler, config.devServer);

          runningWatcher.listen(
            config.devServer.port,
            config.devServer.host,
            function(err) {
              if (err) {
                throw new util.PluginError("webpack-dev-server", err);
              }
              crafty.log(
                "[webpack-dev-server]",
                "Started, listening on " +
                  config.devServer.host +
                  ":" +
                  config.devServer.port
              );
            }
          );
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
      .then(({ compiler, config }) => {
        compiler.run((err, stats) => {
          if (err) {
            printErrors("Failed to compile.", [err]);
            return cb("Webpack compilation failed");
          }

          if (stats.compilation.errors && stats.compilation.errors.length) {
            // Those errors are printed by "onDone"
            //printErrors('Failed to compile.', stats.compilation.errors);
            return cb("Webpack compilation failed");
          }

          return cb();
        });
      })
      .catch(e => {
        printErrors("Failed to compile.", [e]);
        cb(e);
      });
  });
};
