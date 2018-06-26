const path = require("path");
const fs = require("fs");

const chalk = require("chalk");
const webpackMerge = require("webpack-merge");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
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
    webpackConfig = webpackMerge.smart(webpackConfig, require(configPath));
  }

  debug("Webpack configuration", webpackConfig);

  return webpackConfig;
}

function onDone(crafty, webpackConfig, compiler, bundle) {
  return stats => {
    // If we are in watch mode, the bundle is only generated in memory
    // This will copy it to disk, to make refreshes work fine
    // as we don't use the dev-server as a proxy
    if (crafty.isWatching()) {
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

    // Write a complete profile for the webpack run if needed
    if (webpackConfig.profile) {
      const profile = `${webpackConfig.output.path}${path.sep}${
        bundle.name
      }.json`;

      mkdirp.sync(path.dirname(profile));

      fs.writeFile(profile, JSON.stringify(stats.toJson()), err3 => {
        if (!err3) {
          console.log(`Profile written to '${profile}'`);
        }
      });
    }

    webpackOutput(stats, compiler);
  };
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
  let webpackPort = null;
  const compilerReady = portFinder.getFree(taskName).then(freePort => {
    webpackPort = freePort;
    const webpackConfig = prepareConfiguration(crafty, bundle, freePort);
    const compiler = webpack(webpackConfig);

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
      onDone(crafty, webpackConfig, compiler, bundle)
    );

    return compiler;
  });

  compilerReady.catch(e => {
    crafty.log.error("[webpack-dev-server]", "Could not initialize", e);
  });

  // This is executed in watch mode only
  let runningWatcher = null;
  crafty.watcher.addRaw({
    start: () => {
      compilerReady
        .then(
          compiler => {
            // Prepare the Hot Reload Server
            runningWatcher = new WebpackDevServer(compiler, {
              stats: false,
              hot: true,
              hotOnly: true,
              headers: {
                "Access-Control-Allow-Origin": "*"
              }
            });

            runningWatcher.listen(webpackPort, "localhost", function(err) {
              if (err) {
                throw new util.PluginError("webpack-dev-server", err);
              }
              crafty.log(
                "[webpack-dev-server]",
                "Started, listening on localhost:" + webpackPort
              );
            });
          },
          e => {
            crafty.log.error("[webpack-dev-server]", "Could not start", e);
          }
        )
        .catch(e => {
          crafty.log.error("[webpack-dev-server]", "Could not start", e);
        });
    }
  });

  // This is executed in single-run only
  crafty.undertaker.task(taskName, cb => {
    compilerReady.then(compiler => {
      try {
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
      } catch (e) {
        printErrors("Failed to compile.", [e]);
        cb(e);
      }
    }, cb);
  });
};
