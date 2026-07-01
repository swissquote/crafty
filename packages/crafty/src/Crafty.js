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
    // Used for tests
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

  async runAllAsync(fn, ...args) {
    for (const preset of this.loadedPresets) {
      if (preset.implements(fn)) {
        debug(`${preset.presetName}.${fn}()`);
        // eslint-disable-next-line no-await-in-loop
        await preset.run(fn, ...args);
      }
    }
  }

  /**
   * Collect the presets that declare they provide a given capability via their
   * `provides` property, e.g. `provides: { linter: "eslint" }`. An optional
   * `provides.priority` (default 0) breaks ties when several presets provide the
   * same capability — a higher priority wins (e.g. oxlint over eslint).
   *
   * @param {"linter"|"formatter"} capability
   * @returns {{ name: string, value: string, priority: number }[]}
   */
  getProviders(capability) {
    const providers = [];
    for (const preset of this.loadedPresets) {
      if (!preset.implements("provides")) {
        continue;
      }
      const provides = preset.get("provides");
      if (provides && provides[capability]) {
        providers.push({
          name: preset.presetName,
          value: provides[capability],
          priority: provides.priority || 0
        });
      }
    }
    return providers;
  }

  /**
   * Resolve which provider is active for a capability ("linter" / "formatter").
   *
   * The choice is declarative: set `linter`/`formatter` in crafty.config.js to
   * pick one explicitly (matched by family, the part before any ":"). With no
   * explicit choice, a single provider is used automatically; when several are
   * loaded the highest `priority` wins, and a genuine tie throws.
   *
   * @returns {string|null} the resolved family, or null when none is loaded
   */
  resolveProvider(capability, configured) {
    const providers = this.getProviders(capability);

    if (configured) {
      const family = configured.split(":")[0];
      if (!providers.some(provider => provider.value === family)) {
        const available = providers.map(p => p.value).join(", ") || "none";
        throw new Error(
          `Configured ${capability} "${configured}" is not provided by any loaded preset (available: ${available}).`
        );
      }
      return family;
    }

    if (providers.length === 0) {
      return null;
    }

    const maxPriority = Math.max(...providers.map(p => p.priority));
    const top = providers.filter(p => p.priority === maxPriority);
    if (top.length > 1) {
      throw new Error(
        `Multiple ${capability}s are loaded with the same priority (${top
          .map(p => p.value)
          .join(", ")}). Set "${capability}" in your crafty.config.js to choose one.`
      );
    }
    return top[0].value;
  }

  /**
   * The active linter family.
   *
   * @returns {string|null} e.g. "eslint", "oxlint", or null when none is loaded
   */
  getActiveLinter() {
    return this.resolveProvider("linter", this.config.linter);
  }

  /**
   * The prettier version to use, read from the legacy ESLint setting and
   * defaulting to "prettier:1" for backwards compatibility. Kept as an alias so
   * existing configs using `eslint.settings["formatting/mode"]` keep working.
   */
  prettierVersion() {
    return this.config.eslint?.settings?.["formatting/mode"] || "prettier:1";
  }

  /**
   * The active formatter.
   *
   * Like `getActiveLinter()`, but the value may carry a prettier version
   * (e.g. "prettier:2"). The prettier family always resolves to a concrete
   * "prettier:N" so downstream consumers get a usable version.
   *
   * @returns {string|null} e.g. "oxfmt", "prettier:2", or null when none loaded
   */
  getActiveFormatter() {
    const configured = this.config.formatter;
    const family = this.resolveProvider("formatter", configured);

    if (family !== "prettier") {
      return family;
    }

    // An explicit versioned choice (e.g. "prettier:2") wins; otherwise fall back
    // to the legacy ESLint setting / default.
    return configured && configured.includes(":")
      ? configured
      : this.prettierVersion();
  }

  /**
   * The family of the active formatter ("prettier", "oxfmt", …) without any
   * version suffix, or null when no formatter is loaded.
   */
  getFormatterFamily() {
    const formatter = this.getActiveFormatter();
    return formatter ? formatter.split(":")[0] : null;
  }

  isActiveLinter(name) {
    return this.getActiveLinter() === name;
  }

  isActiveFormatter(family) {
    return this.getFormatterFamily() === family;
  }

  get isPNP() {
    try {
      require(`pnpapi`);
      return true;
    } catch {
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
