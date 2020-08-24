exports.description = "Run one or more tasks";
exports.command = function run(crafty, input /*, cli*/) {
  if (!crafty.isWatching()) {
    crafty.createTasks();
  }

  const tasks = input.length ? input : ["default"];
  if (!tasks.length) {
    throw new Error(
      "Could not find a valid task to run, did you register all your presets ?"
    );
  }

  const bundleTypes = Object.keys(crafty.config.bundleTypes);
  const destinations = bundleTypes.map(
    (type) => `           ${type}: ${crafty.config[`destination_${type}`]}`
  );

  crafty.log(`Files will be stored in:\n ${destinations.join("\n")}`);

  return new Promise((resolve, reject) => {
    crafty.undertaker.on("error", (error) => {
      reject(error);
    });

    tasks.forEach((t) => {
      if (!crafty.undertaker.task(t)) {
        crafty.log(`Task '${t}' doesn't exist`);
      }
    });

    crafty.undertaker.parallel(tasks)((error) => {
      if (error) {
        reject(error);
      }
      resolve(0);
    });
  });
};
