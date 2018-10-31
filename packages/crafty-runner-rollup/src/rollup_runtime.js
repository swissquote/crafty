const chalk = require("chalk");
const prettyTime = require("pretty-hrtime");

const paths = require("./utils/paths");
const absolutePath = paths.absolutePath;

const path = require("path");

const batchWarnings = require("./utils/logging");
const handleError = require("./utils/handleError");
const relativeId = require("./utils/relativeId");

const debug = require("debug")("rollup-runner");

function buildConfiguration(crafty, taskName, bundle, warnings) {
  const destination = path.join(
    absolutePath(crafty.config.destination_js),
    bundle.directory ? bundle.directory : "",
    bundle.destination
  );

  const config = {
    input: {
      input: bundle.source,
      plugins: {
        // eslint
        // tslint
        json: {
          plugin: require("rollup-plugin-json"),
          weight: 10
        },
        // babel
        // typescript
        replace: {
          plugin: require("rollup-plugin-replace"),
          weight: 30,
          options: {
            "process.env.NODE_ENV": `"${crafty.getEnvironment()}"`
          }
        },
        pnpResolve: {
          plugin: require("rollup-plugin-pnp-resolve"),
          weight: 35
        },
        resolve: {
          plugin: require("rollup-plugin-node-resolve"),
          weight: 40,
          options: {
            browser: true
          }
        },
        commonjs: {
          plugin: require("rollup-plugin-commonjs"),
          weight: 50
        },
        uglify: {
          plugin: require("rollup-plugin-uglify").uglify,
          weight: 100,
          options: {
            output: {
              comments: function(node, comment) {
                if (comment.type !== "comment2") {
                  return;
                }

                // keep multiline comments containing one of those
                return /@preserve|@license|@cc_on|@class/i.test(comment.value);
              }
            }
          },
          minifier: require("uglify-es").minify,
          init: plugin => {
            return plugin.plugin(plugin.options, plugin.minifier);
          }
        }
      },
      external: bundle.externals
    },
    output: {
      file: destination,
      format: bundle.format || "es",
      sourcemap: true,
      sourcemapFile: destination + ".map"
    }
  };

  // Apply preset configuration
  crafty.getImplementations("rollup").forEach(preset => {
    debug(preset.presetName + ".rollup(Crafty, bundle, rollupConfig)");
    preset.rollup(crafty, bundle, config);
    debug("preset executed");
  });

  // Order and Initialize plugins
  config.input.plugins = Object.keys(config.input.plugins)
    .map(key => config.input.plugins[key])
    .sort((a, b) => {
      const weight_a = a.weight || 0;
      const weight_b = b.weight || 0;
      if (weight_a < weight_b) {
        return -1;
      }

      if (weight_a > weight_b) {
        return 1;
      }

      return 0;
    })
    .map(plugin => {
      return plugin.init ? plugin.init(plugin) : plugin.plugin(plugin.options);
    });

  const onwarn = config.input.onwarn;
  config.input.onwarn = onwarn
    ? warning => onwarn(warning, warnings.add)
    : warnings.add;

  debug(`Final configuration for '${taskName}':`, config);

  return config;
}

function msToHrtime(duration) {
  const hrtime = (duration / 1000 + "").split(".").map(parseFloat);
  hrtime[1] = hrtime[1] * 1000000;

  return hrtime;
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
  debug(`Creating tasks for ${taskName}`);

  const warnings = batchWarnings(taskName);

  // This is executed in watch mode only
  crafty.watcher.addRaw({
    start: () => {
      const rollup = require("rollup");
      const config = buildConfiguration(crafty, taskName, bundle, warnings.add);

      crafty.log(`Start watching with webpack in '${chalk.cyan(taskName)}'`);
      const watchOptions = Object.assign({}, config.input, {
        output: config.output,
        watch: config.watch
      });

      const watcher = rollup.watch(watchOptions);

      watcher.on("event", event => {
        switch (event.code) {
          case "FATAL":
            handleError(event.error, true);
            throw event.error;
            break;

          case "ERROR":
            warnings.flush();
            handleError(event.error, true);
            break;

          case "START":
            crafty.log(`Watch ready for '${chalk.cyan(taskName)}'`);
            break;

          case "BUNDLE_START":
            crafty.log(`Starting '${chalk.cyan(taskName)}' ...`);
            break;

          case "BUNDLE_END":
            const time = prettyTime(msToHrtime(event.duration));
            crafty.log(
              `Finished '${chalk.cyan(taskName)}' after ${chalk.magenta(
                time
              )}\n           Wrote ${chalk.bold(
                event.output.map(relativeId).join(", ")
              )}\n           Waiting for changes...`
            );
            break;

          case "END":
          ///crafty.log(`'${chalk.cyan(taskName)}' is Waiting for changes...`);
        }
      });
    }
  });

  crafty.undertaker.task(taskName, cb => {
    const rollup = require("rollup");
    const config = buildConfiguration(crafty, taskName, bundle, warnings.add);

    function onError(e) {
      warnings.add(e);
      warnings.flush();

      cb(e);
    }

    return rollup
      .rollup(config.input)
      .then(bundle => {
        debug(`Rollup finished parsing files for '${taskName}'`);

        return bundle.write(config.output);
      }, onError)
      .then(warnings.flush, onError);
  });
};
