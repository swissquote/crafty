const colors = require("@swissquote/crafty-commons/packages/ansi-colors");
const prettyTime = require("@swissquote/crafty/packages/pretty-hrtime");

const paths = require("./utils/paths");

const absolutePath = paths.absolutePath;

const path = require("path");

const batchWarnings = require("./utils/logging");
const handleError = require("./utils/handleError");
const relativeId = require("./utils/relativeId");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:runner-rollup"
);

function buildConfiguration(crafty, taskName, bundle, warnings) {
  const destination = path.join(
    absolutePath(crafty.config.destination_js),
    bundle.directory ? bundle.directory : "",
    bundle.destination
  );

  const terserOptions = { ...crafty.config.terser };
  delete terserOptions.sourceMap;

  const config = {
    input: {
      input: bundle.source,
      plugins: {
        // eslint
        json: {
          plugin: require("../packages/rollup-plugin-json"),
          weight: 10
        },
        // babel
        // typescript
        replace: {
          plugin: require("../packages/rollup-plugin-replace"),
          weight: 30,
          options: {
            preventAssignment: true,
            values: {
              "process.env.NODE_ENV": `"${crafty.getEnvironment()}"`
            }
          }
        },
        pnpResolve: {
          plugin: require("../packages/rollup-plugin-pnp-resolve"),
          weight: 35
        },
        resolve: {
          plugin: require("../packages/rollup-plugin-node-resolve"),
          weight: 40,
          options: {
            browser: true,
            extensions: [".mjs", ".js", ".json", ".node"]
          }
        },
        commonjs: {
          plugin: require("../packages/rollup-plugin-commonjs"),
          weight: 50
        },
        terser: {
          plugin: require("../dist/rollup-plugin-terser/index.js").terser,
          weight: 100,
          options: terserOptions
        }
      },
      external: bundle.externals
    },
    output: {
      file: destination,
      format: bundle.format || "es",
      sourcemap: true,
      sourcemapFile: `${destination}.map`
    }
  };

  // Apply preset configuration
  crafty.getImplementations("rollup").forEach(preset => {
    debug(`${preset.presetName}.rollup(Crafty, bundle, rollupConfig)`);
    preset.rollup(crafty, bundle, config);
    debug("preset executed");
  });

  // Order and Initialize plugins
  config.input.plugins = Object.keys(config.input.plugins)
    .map(key => config.input.plugins[key])
    .sort((a, b) => {
      const weightA = a.weight || 0;
      const weightB = b.weight || 0;
      if (weightA < weightB) {
        return -1;
      }

      if (weightA > weightB) {
        return 1;
      }

      return 0;
    })
    .map(plugin => {
      if (plugin.init) {
        return plugin.init(plugin);
      }

      return plugin.plugin.default
        ? plugin.plugin.default(plugin.options)
        : plugin.plugin(plugin.options);
    });

  const onwarn = config.input.onwarn;
  config.input.onwarn = onwarn
    ? warning => onwarn(warning, warnings.add)
    : warnings.add;

  debug(`Final configuration for '${taskName}':`, config);

  return config;
}

function msToHrtime(duration) {
  const hrtime = `${duration / 1000}`.split(".").map(parseFloat);
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
      const rollup = require("../packages/rollup");
      const config = buildConfiguration(crafty, taskName, bundle, warnings.add);

      crafty.log(`Start watching with webpack in '${colors.cyan(taskName)}'`);
      const watchOptions = {
        ...config.input,
        output: config.output,
        watch: config.watch
      };

      const watcher = rollup.watch(watchOptions);

      watcher.on("event", event => {
        switch (event.code) {
          case "FATAL":
            handleError(event.error, true);
            throw event.error;

          case "ERROR":
            warnings.flush();
            handleError(event.error, true);
            break;

          case "START":
            crafty.log(`Watch ready for '${colors.cyan(taskName)}'`);
            break;

          case "BUNDLE_START":
            crafty.log(`Starting '${colors.cyan(taskName)}' ...`);
            break;

          case "BUNDLE_END": {
            const time = prettyTime(msToHrtime(event.duration));
            crafty.log(
              `Finished '${colors.cyan(taskName)}' after ${colors.magenta(
                time
              )}\n           Wrote ${colors.bold(
                event.output.map(relativeId).join(", ")
              )}\n           Waiting for changes...`
            );
            break;
          }

          case "END":
          ///crafty.log(`'${colors.cyan(taskName)}' is Waiting for changes...`);
        }
      });
    }
  });

  crafty.undertaker.task(taskName, cb => {
    const rollup = require("../packages/rollup");
    const config = buildConfiguration(crafty, taskName, bundle, warnings.add);

    function onError(e) {
      warnings.add(e);
      warnings.flush();

      cb(e);
    }

    return rollup
      .rollup(config.input)
      .then(builtBundle => {
        debug(`Rollup finished parsing files for '${taskName}'`);

        return builtBundle.write(config.output);
      }, onError)
      .then(warnings.flush, onError);
  });
};
