exports.description = "Watch for changes, recompile when it happens";
exports.command = function watch(crafty /*, input, cli*/) {
  // Explicitly enter watch mode
  crafty.isWatching(true);

  crafty.createTasks();

  // Run all collected watchers
  crafty.watcher.run();
  return new Promise(() => {
    // We do nothing here, we wait ...
    // If we resolve this promise, the app stops
  });
};
