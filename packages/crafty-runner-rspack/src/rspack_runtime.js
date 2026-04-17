const path = require("node:path");
const fs = require("node:fs");

const colors = require("@swissquote/crafty-commons/packages/ansi-colors");
const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:runner-rspack"
);

const portFinder = require("./utils/find-port.js");
const rspackConfigurator = require("./rspack.js");
const { printStats, printError } = require("./rspack_output.js");

function prepareConfiguration(crafty, bundle, rspackPort) {
  // Base configuration
  let rspackConfig = rspackConfigurator(crafty, bundle, rspackPort);

  const configPath = path.join(process.cwd(), "rspack.config.js");

  if (fs.existsSync(configPath)) {
    crafty.log(`Merging SQ rspack config with ${colors.magenta(configPath)}`);
    const { merge } = require("../packages/webpack-merge.js");
    rspackConfig = merge(rspackConfig, require(configPath));
  }

  debug("Rspack configuration", rspackConfig);

  return rspackConfig;
}

function extractError(error) {
  if (error instanceof Error) {
    if (error.error?.constructor?.name === "ESLintError") {
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
module.exports = function rspackTask(crafty, bundle) {
  const taskName = bundle.taskName;
  const getCompiler = () => {
    return portFinder.getFree(taskName).then(freePort => {
      const config = prepareConfiguration(crafty, bundle, freePort);
      const { rspack } = require("@rspack/core");
      const compiler = rspack(config);

      if (!compiler) {
        throw new Error("Could not create compiler");
      }

      // "invalid" event fires when you have changed a file, and Rspack is
      // recompiling a bundle. WebpackDevServer takes care to pause serving the
      // bundle, so if you refresh, it'll wait instead of serving the old one.
      // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
      compiler.hooks.invalid.tap("CraftyRuntime", () => {
        console.log("Compiling...");
      });

      // TODO : move to done hook in watch and single run
      //compiler.hooks.done.tap("CraftyRuntime", stats => {
      //  printStats(stats, compiler);
      //});

      return { compiler, config };
    });
  };

  // This is executed in watch mode only
  crafty.watcher.addRaw({
    start: () => {
      const compilerReady = getCompiler();

      compilerReady.catch(e => {
        crafty.log.error("Could not initialize Rspack configuration", e);
      });

      compilerReady
        .then(({ compiler, config }) => {
          compiler.watch(config.watchOptions, (error, stats) => {
            printStats(stats);
          });
        })
        .catch(e => {
          crafty.log.error("Rspack watch: Could not start", e);
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
          printStats(stats);

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
            return cb(new crafty.Information("Rspack compilation failed"));
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
