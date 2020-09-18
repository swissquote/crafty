const debug = require("debug")("crafty:tasks");
const merge = require("merge");

function shortName(runner) {
  return runner.indexOf("/") > -1 ? runner.split("/")[0] : runner;
}

function initBundle(crafty, bundle, bundleCreators, type, chosenRunner) {
  const creator = bundleCreators[type][chosenRunner];

  if (bundleCreators[`__${shortName(chosenRunner)}`]) {
    bundleCreators[`__${shortName(chosenRunner)}`](crafty, bundle, creator);
  } else {
    creator(crafty, bundle);
  }
}

function registerTasks(crafty) {
  let bundleCreators = {};
  crafty.getImplementations("bundleCreator").forEach(preset => {
    debug(`${preset.presetName}.bundleCreator(crafty)`);
    bundleCreators = merge.recursive(
      true,
      bundleCreators,
      preset.bundleCreator(crafty)
    );
  });

  const bundleTypes = new Set(
    Object.keys(crafty.config.bundleTypes || {}).concat(
      Object.keys(bundleCreators)
    )
  );

  bundleTypes.forEach(type => {
    // This is a creator override, ignore it.
    if (type.indexOf("__") === 0) {
      return;
    }

    debug(`Creating bundles for type '${type}'`);

    if (
      !crafty.config.hasOwnProperty(type) ||
      typeof crafty.config[type] !== "object"
    ) {
      debug("Nothing to see here");
      return;
    }

    const tasks = [];

    Object.keys(crafty.config[type]).forEach(bundleName => {
      const bundle = crafty.config[type][bundleName];

      // Store the task name and bundle type inside
      bundle.type = type;
      bundle.name = bundleName;
      bundle.taskName = `${type}_${bundleName}`;

      // Infer default destination if it's not specified
      if (!bundle.destination) {
        bundle.destination = `${bundleName}.min.js`;
      }

      if (
        !bundleCreators.hasOwnProperty(type) ||
        Object.keys(bundleCreators[type]).length === 0
      ) {
        crafty.log.error(
          `Could not find bundleCreator for '${type}.${bundleName}', did you forget to load a preset or runner ?`
        );
        return;
      }

      // If there is only one runner for this bundleType, let's go with that
      const configurators = Object.keys(bundleCreators[type]);
      if (!bundle.runner && configurators.length === 1) {
        initBundle(crafty, bundle, bundleCreators, type, configurators[0]);
        tasks.push(bundle.taskName);
        return;
      }

      // The bundle doesn't specify a runner, but we have more than one available
      if (!bundle.runner) {
        throw new Error(
          `You have multiple runners, please specify a runner for '${bundleName}'. Available runners are ['${configurators.join(
            "', '"
          )}'].`
        );
      }

      // The bundleCreator matches by name, go with it
      if (bundleCreators[type][bundle.runner]) {
        initBundle(crafty, bundle, bundleCreators, type, bundle.runner);
        tasks.push(bundle.taskName);
        return;
      }

      const shortNamefilters = configurators.filter(
        runner => shortName(runner) === bundle.runner
      );
      if (shortNamefilters.length > 1) {
        throw new Error(
          `More than one valid runner exists for '${
            bundle.name
          }'. Has to be one of ['${shortNamefilters.join("', '")}'].`
        );
      }

      if (shortNamefilters === 1) {
        initBundle(
          crafty,
          bundle,
          bundleCreators,
          type,
          configurators.first(runner => shortName(runner) === bundle.runner)
        );
        tasks.push(bundle.taskName);
        return;
      }

      throw new Error(
        `Invalid runner '${bundle.runner}' for '${
          bundle.name
        }'. Has to be one of ['${configurators.join("', '")}'].`
      );
    });

    if (tasks.length) {
      crafty.undertaker.task(type, crafty.undertaker.parallel(tasks));
      crafty.addDefaultTask(type);
    }
  });

  // Arbitrary task creation, not related to bundles
  crafty.getImplementations("tasks").forEach(preset => {
    debug(`${preset.presetName}.tasks(crafty)`);
    preset.tasks(crafty);
  });

  const defaultTasks = [].concat(crafty.defaultTasks);
  if (defaultTasks.length) {
    crafty.undertaker.task("default", crafty.undertaker.parallel(defaultTasks));
  }
}

module.exports = registerTasks;
