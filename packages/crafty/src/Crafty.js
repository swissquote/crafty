const Undertaker = require("../packages/undertaker");
const log = require("@swissquote/crafty-commons/packages/fancy-log");

const events = require("./log/events");
const { wasLogged, recordLogged } = require("./log/eventLog");
const formatError = require("./log/formatError");
const syncTask = require("./log/syncTask");
const Watcher = require("./Watcher");
const Information = require("./log/Information");
const registerTasks = require("./tasks");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:core"
);

class Crafty {
  constructor(config, loadedPresets) {
    this.config = config;
    this.loadedPresets = loadedPresets;
    this.log = log;
    this.undertaker = new Undertaker();

    // Replacing the parallel runner with the
    // series runner to have predictable
    // snapshot output when testing Crafty
    if (process.env.TESTING_CRAFTY) {
      this.undertaker.parallel = this.undertaker.series;
    }

    this.watcher = new Watcher(this);
    this.defaultTasks = [];
    events(this);
    syncTask(this);
  }

  error(error) {
    // If we haven't logged this before, log it and add to list
    if (!wasLogged(error)) {
      this.log.error(formatError(error));
      recordLogged(error);
    }
  }

  addDefaultTask(task) {
    this.defaultTasks.push(task);
  }

  isWatching(enable) {
    if (enable !== undefined) {
      return (this.watching = true);
    }
    if (this.watching !== undefined) {
      return this.watching;
    }
    // We assume that when "watch" is present in the arguments,
    // the application is in watch mode even if the watch command
    // hasn't been started yet.
    if (process.argv.some(arg => arg === "watch")) {
      this.watching = true;
      return this.watching;
    }
    this.watching = false;
    return this.watching;
  }

  getEnvironment() {
    // Should not be used manually, only for tests
    if (this.config.environment) {
      return this.config.environment;
    }
    // If we're watching it means "development"
    if (this.isWatching()) {
      return "development";
    }
    // All other cases are production
    // The "test" environment is defined by the test runner itself
    return "production";
  }

  getImplementations(method) {
    return this.loadedPresets.filter(preset => preset.implements(method));
  }

  runAllSync(fn, ...args) {
    for (const preset of this.loadedPresets) {
      if (preset.implements(fn)) {
        debug(`${preset.presetName}.${fn}()`);
        preset.run(fn, ...args);
      }
    }
  }

  get isPNP() {
    try {
      require(`pnpapi`);
      return true;
    } catch (error) {
      return false;
    }
  }

  get loglevel() {
    // If a DEBUG environemnt variable is passed, automatically switch to loglevel 3
    if (process.env.DEBUG) {
      return 3;
    }
    // Check for the verbose flag in CLI
    if (process.argv.some(arg => arg === "--verbose")) {
      return 2;
    }
    return 1;
  }

  createTasks() {
    debug("Registering Tasks");
    registerTasks(this);
  }
}

Crafty.prototype.Information = Information;

module.exports = Crafty;
